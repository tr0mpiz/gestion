import { ProductModel } from "../DAO/models/product.model.js";

export class ProductService {
    validateUser(title, description, price, thumbnail, code, stock, status, category) {
        if (!title || !description || !price || !thumbnail || !code || !stock || !status || !category) {
            console.log("validation error: please complete firstName, lastname and email.");
            throw new Error("validation error: please complete firstName, lastname and email.");
        }
    }
    async getAll() {
        const products = await ProductModel.find({});
        return products;
    }

    async getById(id) {
        const products = await ProductModel.find({ _id: id });
        return products;
    }

    async createOne(title, description, price, thumbnail, code, stock, status, category) {
        console.log("validate", title, description, price, thumbnail, code, stock, status, category);
        this.validateUser(title, description, price, thumbnail, code, stock, status, category);
        const productCreated = await ProductModel.create({ title, description, price, thumbnail, code, stock, status, category });
        return productCreated;
    }

    async createMany(array) {
        array.forEach((element) => {
            this.validateUser(element.title, element.description, element.price, element.thumbnail, element.code, element.stock, element.status, element.category);
        });
        const productCreated = await ProductModel.insertMany(array);
        return productCreated;
    }

    async deletedOne(_id) {
        const deleted = await ProductModel.deleteOne({ _id: _id });
        return deleted;
    }

    async updateOne(_id, title, description, price, thumbnail, code, stock, status, category) {
        if (!_id) throw new Error("invalid _id");
        this.validateUser(title, description, price, thumbnail, code, stock, status, category);
        const productUptaded = await ProductModel.updateOne({ _id }, { title, description, price, thumbnail, code, stock, status, category });
        return productUptaded;
    }
}
