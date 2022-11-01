export class CalculateCost {
  private subtotal = 0
  private totalCost = 0
  private importCost = 0

  constructor(public unitPrice = 0, public itemsQuantity = 0, public tax = 0) {}

  setItemsQuantity(quantity: number) {
    this.itemsQuantity = quantity

    return this
  }

  setTax(tax: number) {
    this.tax = tax

    return this
  }

  setUnitPrice(price: number) {
    this.unitPrice = price

    return this
  }

  getSubtotal() {
    this.subtotal = this.itemsQuantity * this.unitPrice
    return this.subtotal
  }

  getImportCost() {
    this.importCost = this.tax * this.getSubtotal()

    return this.importCost
  }

  getTotal() {
    this.totalCost = this.importCost + this.getSubtotal()
    return this.totalCost
  }
}
