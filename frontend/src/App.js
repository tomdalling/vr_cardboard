import React, { Component } from 'react';
import './App.css';

class Server {
  fetchProducts() {
    return this.request("/products")
      .then(payload => payload.products)
  }

  fetchCurrentOrder() {
    return this.request("/orders/current")
  }

  addToOrder(product, quantity) {
    //TODO: here
    console.log("Add to order:", product, quantity)
    return this.fetchCurrentOrder()
  }

  submitOrder() {
    //TODO: here
    console.log("Submit order")
    return this.fetchCurrentOrder()
      .then(order => ({...order, confirmed: true}))
  }

  request(path) {
    return fetch("http://localhost:4000" + path)
      .then(response => response.json())
      .then(body => {
        if('data' in body) {
          return body.data
        } else {
          return Promise.reject(body.errors)
        }
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

  handleAddToOrder = (product, quantity) => {
    this.setState({ order: {...this.state.order, dirty: true} })

    this.server.addToOrder(product, quantity)
      .then(order => this.setState({ order: order }))
  }

  handleOrderSubmit = (event) => {
    event.preventDefault()
    this.setState({ order: {...this.state.order, confirmed: "in_progress"} })
    this.server.submitOrder()
      .then(order => this.setState({ order: order }))
  }

  render() {
    return (
      <div>
        <h1>VR Cardboard Store</h1>
        <div style={{ float: 'left' }}>
          <ProductList
            products={this.state.products}
            onAddToOrder={this.handleAddToOrder}
            />
        </div>
        <div style={{ float: 'right' }}>
          <Order
            order={this.state.order}
            onSubmit={this.handleOrderSubmit}
            />
        </div>
      </div>
    )
  }
}

class ProductList extends Component {
  render() {
    const products = this.props.products
    if(products) {
      return (
        <div>
          {this.props.products.map(product =>
            <Product
              product={product}
              onAddToOrder={this.props.onAddToOrder}
              key={product.id}
              />
          )}
        </div>
      )
    } else {
      return <div>Loading catalogue...</div>
    }
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
      <div>
        <h2>{product.title}</h2>
        <p>{formatCurrency(product.price)} each</p>
        <p>
          Quantity:
          <input value={this.state.quantity} onChange={this.handleQuantityChange} />
          <button onClick={this.onAddToOrder} disabled={!this.isQuantityValid()}>
            Add to order
          </button>
        </p>
      </div>
    )
  }
}

class Order extends Component {
  render() {
    const order = this.props.order

    let body;
    if(!order) {
      body = <p>Loading...</p>
    } else if(order.items.length === 0){
      body = <p>No items yet</p>
    } else if(order.confirmed === "in_progress") {
      body = <p>Submitting your order...</p>
    } else if(order.confirmed) {
      body = <p>Order submitted. Thank you for you patronage.</p>
    } else {
      body = <InProgressOrder order={order} onSubmit={this.props.onSubmit} />
    }

    return (
      <div>
        <h2>Order</h2>
        { body }
      </div>
    )
  }
}

class InProgressOrder extends Component {
  render() {
    const order = this.props.order
    const items = order.items.map(i =>
      <OrderItem item={i} key={i.product.id} />
    )
    const adjustments = order.adjustments.map(adj =>
      <Adjustment
        description={adj.description}
        amount={adj.amount}
        key={adj.description}
        />
    )
    const total = <Adjustment description="Total" amount={order.total} key="Total"/>

    return (
      <form onSubmit={this.props.onSubmit}>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            { items }
            { order.dirty ? (
              <tr><td colSpan="4">Updating order...</td></tr>
            ) : (
              [...adjustments, total]
            ) }
          </tbody>
        </table>
        { !order.dirty && <button>Submit order</button> }
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
        <td>{item.quantity}</td>
        <td>{formatCurrency(item.product.price)}</td>
        <td>{formatCurrency(item.product.price * item.quantity)}</td>
      </tr>
    )
  }
}

function Adjustment(props) {
  return (
    <tr>
      <td colSpan="3">{ props.description }</td>
      <td>{ formatCurrency(props.amount) }</td>
    </tr>
  )
}

function formatCurrency(cents) {
  return "$" + (cents / 100).toFixed(2)
}

export default App;
