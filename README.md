# Inventory Management Application

## Overview
Tech stacks are:  Vue3, Typescript, Material UI
This is a simple inventory management web application that allows users to:

- View a list of inventory items
- Add new items
- Edit existing items

## Pages and Routing

The application has the following pages:

1. **Inventory List Page**

   - **Route**: `/`
   - Displays all inventory items in a table view.

2. **Add Item Page**

   - **Route**: `/form`
   - Allows users to add a new inventory item using a form.

3. **Edit Item Page**
   - **Route**: `/form/:id`
   - Opens the same form as the Add page but pre-filled with data of the item selected for editing.

Routing is handled using Vue Router with history mode enabled.

### Install Dependencies

```
npm install
```

### Running the application

```
npm run serve
```

### Run your unit tests

```
npm run test:unit
```

### Run your end-to-end tests

```
npm run test:e2e
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

# fruit-app
