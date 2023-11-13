//PRODUCT MANAGER
const fs = require("fs");

class ProductManager {
  constructor(path) {
    this.path = path;
    if (fs.existsSync(path)) {
      try {
        let products = fs.readFileSync(path, "utf-8");
        this.products = JSON.parse(products);
      } catch {
        this.products = [];
      }
    } else {
      this.products = [];
    }
  }
  async saveFile(data) {
    try {
      await fs.promises.writeFile(this.path, JSON.stringify(data, null, "\t"));
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async addProduct(productoAgregado) {
    if (
      !productoAgregado.code ||
      !productoAgregado.title ||
      !productoAgregado.price ||
      !productoAgregado.thumbnail ||
      !productoAgregado.stock ||
      !productoAgregado.description
    ) {
      console.log("Faltan valores obligatorios.");
      return "Faltan valores obligatorios.";
    }

    const existingProduct = this.products.find(
      (product) => product.code === productoAgregado.code
    );

    if (existingProduct) {
      console.log(`El código "${productoAgregado.code}" ya está en uso. Por favor, elija un código único.`);
      return `El código "${productoAgregado.code}" ya está en uso. Por favor, elija un código único.`;
    }

    if (this.products.length === 0) {
      productoAgregado.id = 1;
    } else {
      productoAgregado.id = this.products[this.products.length - 1].id + 1;
    }

    this.products.push(productoAgregado);

    const respuesta = await this.saveFile(this.products);

    if (respuesta) {
      console.log("Producto Agregado");
    } else {
      console.log("Hubo un error al agregar el producto");
    }
  }

  async getProducts() {
    try {
      const products = await this.readFile();
      return products;
    } catch (error) {
      console.error("Hubo un error al leer el archivo de productos.");
      return "Error al leer el archivo de productos";
    }
}

  async getProductById(id) {
    try {
      const products = await this.readFile();
      const product = products.find((product) => product.id === id);
  
      if (product) {
        return product;
      } else {
        return "Producto no encontrado";
      }
    } catch (error) {
      console.error("Hubo un error al leer el archivo de productos.");
      return "Error al leer el archivo de productos";
    }
  }
  
  async readFile() {
    try {
      const data = await fs.promises.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async updateProduct(id, updatedFields) {
    const index = this.products.findIndex((product) => product.id === id);
  
    if (index !== -1) {
    
      updatedFields.id = id;
  
      Object.assign(this.products[index], updatedFields);
  
      const success = await this.saveFile(this.products);
      if (success) {
        console.log(`Producto con ID ${id} actualizado.`);
      } else {
        console.log("Hubo un error al actualizar el producto.");
      }
    } else {
      console.log(`Producto con ID ${id} no encontrado.`);
    }
  }

  async deleteProduct(id) {
    const index = this.products.findIndex((product) => product.id === id);

    if (index !== -1) {
      this.products.splice(index, 1);

      const success = await this.saveFile(this.products);
      if (success) {
        console.log(`Producto con ID ${id} eliminado.`);
      } else {
        console.log("Hubo un error al eliminar el producto.");
      }
    } else {
      console.log(`Producto con ID ${id} no encontrado.`);
    }
  }
}
class Product {
  constructor(code, title, description, price, thumbnail, stock) {
    (this.code = code),
      (this.title = title),
      (this.description = description),
      (this.price = price),
      (this.thumbnail = thumbnail),
      (this.stock = stock);
  }
}

//Pruebas
async function runTest() {
  console.log("Se crea ProductManager");
  const productManager = new ProductManager('productos.json');
 
  try{
    console.log("Se devuelve el array de productos vacio");
    console.log(await productManager.getProducts());
    console.log("Se agrega el producto abc123");
    await productManager.addProduct(
      new Product(
        "abc123",
        "producto prueba",
        "Este es un producto prueba",
        200,
        "Sin imagen",
        25
      )
    );   
    console.log("Se muestra el array de productos con el producto abc123");
    console.log(await productManager.getProducts()); 

    console.log("Se intenta cargar un nuevo producto sin nombre");
    await productManager.addProduct(
      new Product("abc124", "Este es un producto prueba", 200, "Sin imagen", 25)
    );
    console.log("Se muestra el array de productos con el producto abc123 (porque no se agregó el nuevo");
    console.log(await productManager.getProducts());
    
    console.log("Se intenta cargar un nuevo producto con codigo repetido");
    await productManager.addProduct(
      new Product(
        "abc123",
        "producto prueba",
        "Este es un producto prueba",
        200,
        "Sin imagen",
        25
      )
    );
    
    console.log(
      "Se muestra el array de productos con el producto abc123 (porque no se agregó el nuevo con código repetido)"
    );
    console.log(await productManager.getProducts());
    
    console.log("Se agrega el producto abc124 correctamente");
    await productManager.addProduct(
      new Product(
        "abc124",
        "producto prueba 124",
        "Este es un producto prueba",
        200,
        "Sin imagen",
        25
      )
    );
    
    console.log("Se muestra el array de productos con los 2 productos");
    console.log(await productManager.getProducts());
    
    console.log("Se muestra el producto con id  1");
    console.log(await productManager.getProductById(1));
    
    console.log("Se muestra el producto con id  25 (error)");
    console.log(await productManager.getProductById(25));
    
    console.log("Se intenta actualizar el producto con ID 1");
    const updatedFields = {
      price: 250,
    };
    await productManager.updateProduct(1, updatedFields);
    
    console.log("Se muestra el producto actualizado:");
    console.log(await productManager.getProductById(1));
    
    console.log("Se intenta eliminar el producto con ID 1");
    await productManager.deleteProduct(1);
    
    console.log("Se muestra el array de productos después de eliminar el producto:");
    console.log(await productManager.getProducts());
  } catch (error) {
    console.log('Hubo un error al ejecutar el test ({$error})')
    return error;
  }
}
runTest();
module.exports = ProductManager;