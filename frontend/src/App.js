import React, { Component } from 'react';
import './App.css';

class Server {
  fetchProducts() {
    return this.request("GET", "/products")
      .then(payload => payload.products)
  }

  fetchCurrentOrder() {
    return this.request("GET", "/orders/current")
  }

  addToOrder(order, product, quantity) {
    return this.request("POST", `/orders/${order.id}/items`, {
      "item[product_id]": product.id,
      "item[quantity]": quantity,
    })
  }

  submitOrder(order) {
    return this.request("POST", `/orders/${order.id}/confirm`)
  }

  request(method, path, params) {
    let options = { method: method }

    if(params) {
      let formData = new FormData()
      for(const key of Object.keys(params)) {
        formData.append(key, params[key])
      }
      options.body = formData
    }

    return this.delay(500)
      .then(() => fetch("http://localhost:4000" + path, options))
      .then(response => response.json())
      .then(body => {
        if('data' in body) {
          return body.data
        } else {
          return Promise.reject(body.errors)
        }
      })
  }

  delay(milliseconds) {
    return new Promise((resolve, _) => {
      setTimeout((() => resolve()), milliseconds)
    })
  }
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      order: null,
      products: null,
    }
    this.server = new Server()
  }

  componentDidMount() {
    this.fetchProducts()
    this.fetchCurrentOrder()
  }

  fetchProducts() {
    this.server.fetchProducts()
      .then(products => this.setState({ products: products }))
  }

  fetchCurrentOrder() {
    this.server.fetchCurrentOrder()
      .then(order => ({...order, dirty: false}))
      .then(order => this.setState({ order: order }))
  }

  optimisticAddToOrder(product, quantity) {
    const order = this.state.order
    const existingItem = order.items.find(i => i.product.id === product.id)

    let newItems
    if(existingItem) {
      newItems = order.items.map(i =>
        // update quantity in existing item
        i === existingItem ? {...i, quantity: i.quantity + quantity } : i
      )
    } else {
      // append new item
      newItems = [...order.items, { quantity: quantity, product: product }]
    }

    return {...order, items: newItems, dirty: true}
  }

  handleAddToOrder = (product, quantity) => {
    this.setState({ order: this.optimisticAddToOrder(product, quantity) })

    this.server.addToOrder(this.state.order, product, quantity)
      .then(order => this.setState({ order: order }))
  }

  handleOrderSubmit = (event) => {
    event.preventDefault()
    this.setState({ order: {...this.state.order, confirmed: "in_progress"} })
    this.server.submitOrder(this.state.order)
      .then(order => this.setState({ order: order }))
  }

  handleNewOrder = () => {
    this.setState({ order: null })
    this.fetchCurrentOrder()
  }

  render() {
    return (
      <div className="container p-4 mx-auto">
        <h1 className="mb-4">VR Cardboard Store</h1>
        <div className="flex">
          <ProductList
            products={this.state.products}
            onAddToOrder={this.handleAddToOrder}
            />
          <Order
            order={this.state.order}
            onSubmit={this.handleOrderSubmit}
            onNewOrder={this.handleNewOrder}
            />
        </div>
      </div>
    )
  }
}

class ProductList extends Component {
  render() {
    const products = this.props.products
    return (
      <div className="w-1/2 pr-4">
        <h2 className="mb-4">Catalogue</h2>
        { products ? (
          this.props.products.map(product =>
            <Product
              product={product}
              onAddToOrder={this.props.onAddToOrder}
              key={product.id}
              />
          )
        ) : (
          <p className="p-4 bg-white">Loading catalogue...</p>
        ) }
      </div>
    )
  }
}

class Product extends Component {
  constructor(props) {
    super(props)
    this.state = { quantity: "1" }
  }

  onAddToOrder = (event) => {
    this.props.onAddToOrder(this.props.product, this.parseQuantity())
  }

  handleQuantityChange = (event) => {
    this.setState({ quantity: event.target.value });
  }

  isQuantityValid() {
    return this.parseQuantity() !== null
  }

  parseQuantity() {
    //check that string only contains digits
    if(!/^\d+$/.test(this.state.quantity)){
      return null
    }

    const quantity = parseInt(this.state.quantity, 10)
    if(isNaN(quantity) || quantity <= 0) {
      return null
    }

    return quantity
  }

  render() {
    const product = this.props.product
    return (
      <div className="bg-white p-4 mb-4">
        <div className="mb-4">
          <h3 className="mb-2 inline mr-4">{product.title}</h3>
          <span className="mb-2">{formatCurrency(product.price)} each</span>
        </div>
        <div>
          Quantity:
          <input
            className="border border-orange-light rounded w-12 p-2 mx-2"
            value={this.state.quantity}
            onChange={this.handleQuantityChange}
            />
          <button className="btn px-4 py-1" onClick={this.onAddToOrder} disabled={!this.isQuantityValid()}>
            Add to order
          </button>
        </div>
      </div>
    )
  }
}

class Order extends Component {
  render() {
    const order = this.props.order

    let body;
    if(!order) {
      body = <span>Loading...</span>
    } else if(order.items.length === 0){
      body = <span>No items yet</span>
    } else if(order.confirmed === "in_progress") {
      body = <span>Submitting your order...</span>
    } else if(order.confirmed) {
      body = <CompletedOrder order={order} onNewOrder={this.props.onNewOrder} />
    } else {
      body = <InProgressOrder order={order} onSubmit={this.props.onSubmit} />
    }

    return (
      <div className="w-1/2">
        <h2 className="mb-4">Your Order</h2>
        <div className="bg-white p-4">
          { body }
        </div>
      </div>
    )
  }
}

function CompletedOrder(props) {
  return (
    <div>
      <p>Order submitted. Your order number is #{props.order.id}.</p>
      <p>Thank you for you patronage.</p>
      <button className="btn p-2" onClick={props.onNewOrder}>
        Start new order
      </button>
    </div>
  )
}

class InProgressOrder extends Component {
  render() {
    const order = this.props.order
    const items = order.items.map(i =>
      <OrderItem item={i} key={i.product.id} />
    )
    const adjustments = order.adjustments.map((adj, idx) =>
      <Adjustment
        description={adj.description}
        amount={adj.amount}
        key={adj.description}
        rowClassName={ idx === 0 ? "border-t" : undefined }
        />
    )
    const total = <Adjustment
      description="Total"
      amount={order.total}
      key="Total"
      rowClassName="font-bold"
      amountClassName="border-t border-b border-black"
      />

    return (
      <form onSubmit={this.props.onSubmit}>
        <table className="w-full mb-4">
          <thead>
            <tr className="bg-orange-lighter">
              <th>Item</th>
              <th className="numeric">Quantity</th>
              <th className="numeric">Unit Price</th>
              <th className="numeric">Total</th>
            </tr>
          </thead>
          <tbody>
            { items }
            { order.dirty ? (
              <tr><td colSpan="4" className="text-center">Updating order...</td></tr>
            ) : (
              [...adjustments, total]
            ) }
          </tbody>
        </table>
        { !order.dirty &&
          <button className="btn w-full p-2">
            Submit order
          </button>
        }
      </form>
    )
  }
}

class OrderItem extends Component {
  render() {
    const item = this.props.item

    return (
      <tr>
        <td>{item.product.title}</td>
        <td className="numeric">{item.quantity}</td>
        <td className="numeric">{formatCurrency(item.product.price)}</td>
        <td className="numeric">{formatCurrency(item.product.price * item.quantity)}</td>
      </tr>
    )
  }
}

function Adjustment(props) {
  return (
    <tr className={props.rowClassName}>
      <td colSpan="3" className="text-right">{ props.description }</td>
      <td className={"numeric " + (props.amountClassName || "")}>
        { formatCurrency(props.amount) }
      </td>
    </tr>
  )
}

function formatCurrency(cents) {
  return "$" + (cents / 100).toFixed(2)
}

export default App;
