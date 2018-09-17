import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      order: null,
      products: null,
    }
    this.fetchProducts()
    this.fetchOrder()
  }

  fetchProducts() {
    //TODO: proper backend fetch
    setTimeout(() => {
      this.setState({products: [
        { id: 100, title: "High Quality", price: 2000 },
        { id: 200, title: "Premium", price: 3000 },
      ]})
    }, 500)
  }

  fetchOrder() {
    //TODO: proper backend fetch
    setTimeout(() => {
      this.setState({ order: {
        items: [
          {
            quantity: 2,
            product: { id: 100, title: "High Quality", price: 2000 },
          }, {
            quantity: 5,
            product: { id: 200, title: "Premium", price: 3000 },
          },
        ],
        adjustments: [
          { description: "Shipping", amount: 3000 },
          { description: "Bulk discount", amount: -5000 },
        ],
        total: 12345,
        dirty: false,
      } })
    }, 500)
  }

  handleAddToOrder = (product, quantity) => {
    //TODO: here
    console.log("Add to order:", product, quantity)
    this.setState({ order: {...this.state.order, dirty: true} })
    this.fetchOrder()
  }

  handleOrderSubmit = () => {
    //TODO: here
    console.log("Submit order:", this.state.order)
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

    if(!order) {
      return <div>Loading order...</div>
    }

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
        <h2>Order</h2>
        { order.items.length === 0 ? (
          <p>No items yet</p>
        ) : (
          <div>
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
            { !order.dirty && <input type="submit" value="Submit order" /> }
          </div>
        ) }
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
