import { body, param } from "express-validator";

export const productValidatorRules = [
  body("name").notEmpty().withMessage('El nombre del producto es obligatorio'),
  body("price")
    .isNumeric().withMessage('Valor inválido')
    .notEmpty().withMessage('El precio del producto es obligatorio')
    .custom(value => value > 0).withMessage('Precio inválido')
]

export const availabilityValidatorRules = [
  body("availability").isBoolean().withMessage('Valor en disponibilidad inválido')
]

export const productByIdValidatorRules = [
  param('id').isInt().withMessage('Id inválido')
]

export const productUpdateValidatorRules = [
  ...productValidatorRules,
  ...availabilityValidatorRules,
  ...productByIdValidatorRules
]