import { RequestHandler, Router } from "express"
import Joi from "joi"
import { ContainerTypes, createValidator, ValidatedRequest, ValidatedRequestSchema } from "express-joi-validation"
import { Restaurant } from "../../util/types";
import { addRestaurant } from "../../models/restaurant.model";
const validator = createValidator();

export interface AddRestaurantSchema extends ValidatedRequestSchema {
    [ContainerTypes.Body]: Omit<Restaurant, 'id'>
}

// TODO: define a query object (pagination?, filters?)
const expectedBody = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    phoneNumber: Joi.string().length(10).pattern(/^[0-9]+$/),
    openingTime: Joi.date().timestamp(),
    closingTime: Joi.date().timestamp(),
    location: Joi.string().required(),
    tables: Joi.object({
        twoPersonTables: Joi.number().required(),
        fourPersonTables: Joi.number().required(),
        eightPersonTables: Joi.number().required(),
    }).allow(null)
});

const main: RequestHandler = async (req: ValidatedRequest<AddRestaurantSchema>, res, next) => {
    try {
        const newRestaurant = await addRestaurant(req.body);

        if (newRestaurant) {
            res.status(200).send(newRestaurant);
        }
    } catch (err) {
        next(err)
    }
}

export const addRestaurantController = Router().use(validator.body(expectedBody), main);