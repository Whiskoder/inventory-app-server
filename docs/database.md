## API endpoints v1

### Methods:

#### Products

- `POST` `/api/v1/products/`: Create a new product.
- `GET` `/api/v1/products/`: Retrieve all products using **Filtering**, **Sorting**, **Pagination**.
- `GET` `/api/v1/products/{productId}`: Retrieve a single product by **ID**.
- `PUT` `/api/v1/products/{productId}`: Update product by **ID**.
- `DELETE` `/api/v1/products/{productId}`: Disable a product.

#### Product prices

- `POST` `/api/v1/products/{productId}/prices`: Create a new price for a product.
<!-- - `GET` `/api/v1/products/{productId}/prices`: Retrieve all prices for a product using **Pagination** -->
- `PUT` `/api/v1/products/{productId}/prices/{priceId}`: Update a price for a product.
- `DELETE` `/api/v1/products/{productId}/prices/{priceId}`: Delete a price for a product.

#### Categories

- `POST` `/api/v1/categories/`: Create a new category.
- `GET` `/api/v1/categories/`: Retrieve all categories using **Pagination**
- `GET` `/api/v1/categories/{categoryName}`: Retrieve a single category by **name**.
- `PUT` `/api/v1/categories/{categoryId}`: Update a category by **ID**.
- `DELETE` `/api/v1/categories/{categoryId}`: Disable a category by **ID**.

#### Branches

- `POST` `/api/v1/branches/`: Create a new branch.
- `GET` `/api/v1/branches/`: Retrieve all branches using **Pagination**
- `GET` `/api/v1/branches/{branchId}`: Retrieve a single branch by **ID**.
- `PUT` `/api/v1/branches/{branchId}`: Update a branch by **ID**.
- `DELETE` `/api/v1/branches/{branchId}`: Disable a branch by **ID**.

#### Invoices

- `POST` `/api/v1/invoices/`: Create a new invoice.
- `GET` `/api/v1/invoices/`: Retrieve all invoices using **Pagination, Filtering, Sorting**
- `GET` `/api/v1/invoices/{invoiceId}`: Retrieve a single invoice by **ID**.
- `PUT` `/api/v1/invoices/{invoiceId}`: Update an invoice by **ID**.
- `DELETE` `/api/v1/invoices/{invoiceId}`: Disable an invoice by **ID**.

#### Providers

- `POST` `/api/v1/providers/`: Create a new provider.
- `GET` `/api/v1/providers/`: Retrieve all providers using **Pagination**
- `GET` `/api/v1/providers/{providerId}`: Retrieve a single provider by **ID**.
- `PUT` `/api/v1/providers/{providerId}`: Update a provider by **ID**.
- `DELETE` `/api/v1/providers/{providerId}`: Disable a provider by **ID**.

#### Orders

- `POST` `/api/v1/orders/`: Create a new order, `branchId` and `deliveryDate` must be provided.
- `POST` `/api/v1/orders/{orderId}/next`: Continue to the next step in order process.
- `POST` `/api/v1/orders/{orderId}/cancel`: Cancel the order
- `GET` `/api/v1/orders/`: Retrieve all orders using **Pagination, Filtering, Sorting**
- `GET` `/api/v1/orders/{orderId}`: Retrieve a single order by **ID**.
- `PUT` `/api/v1/orders/{orderId}`: Update an order by **ID**, only if the order is in a state where it can be updated.
- `DELETE` `/api/v1/orders/{orderId}`: Delete an order by **ID**, only if the order is in a state where it can be deleted.

#### Order items

- `POST` `/api/v1/orders/{orderId}/items/`: Create a multiple order items, max (50)
- `GET` `/api/v1/orders/{orderId}/items/`: Retrieve all items for an order by **Order ID**.
- `GET` `/api/v1/orders/{orderId}/items/{itemId}`: Retrieve a single order item by **Order ID and Item ID**.
- `PUT` `/api/v1/orders/{orderId}/items/{itemId}`: Update an order item by **Order ID and Item ID**.
- `DELETE` `/api/v1/orders/{orderId}/items/{itemId}`: Delete an order item by **Order ID and Item ID**.

## Products entities

### Product

#### Properties:

- `id`: number (Primary Key)
- `name`: string (Required, Unique)
- `measureUnit`: string (Required) [MeasureUnit](#measure-unit)

### ProductPrice

#### Properties:

- `id`: number (Primary Key)
- `productId`: number (Foreign Key to ProductEntity)
- `providerId`: number (Foreign Key to ProviderEntity)
- `basePrice`: number (Required)
- `quantity`: number (Required)

---

## Categories entities

### Category

#### Properties:

- `id`: number (Primary Key)
- `name`: string (Required)
- `description`: string (Optional)

## Order entities

### Order

#### Properties:

- `id`: number (Primary Key)
- `createdAt`: timestampz (Auto-generated)
- `completedAt`: timestampz (Optional)
- `deliveryDate`: timestampz (Required)
- `status`: string (Defaults to 'OPEN')
- `totalAmount`: number (Calculated)
- `totalItems`: number (Calculated)
- `branchId`: number (Foreign Key to BranchEntity)
- `userId`: number (Foreign Key to UserEntity) (Calculated)
- `items`: array of [OrderItem](#orderitem) (Calculated)
- `notes`: string (Optional)

### OrderItem

#### Properties:

The product price ID is required only on creating or updating item, this property will be used for calculating productId, providerId and basePrice, is not a property of the entity but will be used for the calculation.

- `id`: number (Primary Key)
- `orderId`: number (Foreign Key to OrderEntity)
- `productPriceId`: number (Foreign Key to ProductEntity)
- `basePriceAtOrder`: number (Calculated)
- `productId`: number (Foreign Key to ProductEntity)
- `providerId`: number (Foreign Key to ProviderEntity)
- `quantityRequested`: number (Required)
- `quantityDelivered`: number (optional)
- `measurementUnit`: string (Calculated)

## Provider entities

### Provider

#### Properties:

- `id`: number (Primary Key)
- `name`: string (Required)
- `description`: string (Optional)
- `contactEmail`: string (Optional)
- `contactPhone`: string (Optional)
- `rfc`: string (Required)
- `streetName`: string (Optional)
- `cityName`: string (Optional)
- `dependantLocality`: string (Optional)
- `postalCode`: string (Optional)

## Notas

- Cuando se deshabilite un producto, cambiar el nombre
- https://www.npmjs.com/package/qs
- Taxes
- Discounts

## Objects

### Order status

```ts
interface OrderStatus {
  OPEN: 0
  PROCESSING: 1
  DELIVERED: 2
  COMPLETED: 3
  CANCEL_REQUESTED: 4
  CANCELED: 5
  ONHOLD: 6
  REFUNDED: 7
  RETURNED: 8
}
```

### Measure unit

```ts
interface MeasureUnits {
  grams: {
    shortName: 'gr'
    precision: 0 // 1/1th of a gram (1)
  }
  kilograms: {
    shortName: 'kg'
    precision: 1 // 1/10th of a kilogram (0.1)
  }
  mililiters: {
    shortName: 'ml'
    precision: 0 // 1/1th of a mililiter (1)
  }
  liters: {
    shortName: 'l'
    precision: 1 // 1/10th of a liter (0.1)
  }
  boxes: {
    shortName: 'box'
    precision: 0 // 1/1th (1)
  }
  pieces: {
    shortName: 'pcs'
    precision: 0 // 1/1th (1)
  }
  ounces: {
    shortName: 'oz'
    precision: 0 // 1/1th of a ounce (1)
  }
  gallons: {
    shortName: 'gal'
    precision: 1 // 1/10th of a gallon (0.1)
  }
}
```
