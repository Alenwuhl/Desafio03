const express = require("express");
const ProductManager = require("./ProductManager");

const productManager = new ProductManager('productos.json')

const app = express()
const port = 8080

app.use(express.urlencoded({ extended: true }));

app.get("/products", async (req, res) => {
    const products = await productManager.getProducts()
    const { limit } = req.query

    if (!limit) {
        try{
            res.json(products);
        } catch (error) {
            console.error("Hubo un error al devolver los productos", error);
            res.status(500).send("Hubo un error al devolver los productos");
        }
    } else {
        try {
            const parsedLimit = parseInt(limit)

            if (isNaN(parsedLimit) || parsedLimit <= 0) {
                return res.send(`El parametro que estableciste como limite (${limit} no es un numero entero.)`)
            }
            const limitedProducts = products.slice(0, parsedLimit);
            res.json(limitedProducts);

        } catch (error) {
            console.error("Hubo un error al devolver los productos con el limite determinado", error);
            res.status(500).send("Hubo un error al devolver los productos con el limite determinado");
        }
    }
})

app.get("/products/:pID", async (req, res) => {

    const { pID } = req.params

    if (!pID || pID.trim() === "") {
        try{
            const products = await productManager.getProducts()
            res.json(products);
        } catch (error) {
            console.error("Hubo un error al devolver los productos", error);
            res.status(500).send("Hubo un error al devolver los productos");
        }
    } else {
        try{
            const pIDNum = parseInt(pID)
            const product = await productManager.getProductById(pIDNum)
            res.json(product)
        } catch (error) {
            console.error("Hubo un error al devolver los productos a traves del ID", error);
            res.status(500).send(`Hubo un error al devolver los productos a traves del ID: ${pID}`);
        }
    }

})

app.listen(8080, () => console.log(`Server listening on port ${port}`))