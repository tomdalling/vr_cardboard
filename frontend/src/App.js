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

  handleAddToOrder = (product, quantity) => {
    //TODO: here
    console.log(product, quantity)
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
          <Order order={this.state.order} />
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
    return (
      <form>
        Order form goes here
      </form>
    )
  }
}

function formatCurrency(cents) {
  return "$" + (cents / 100).toFixed(2)
}

export default App;
