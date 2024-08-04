import { sequelize } from "../infra/DatabaseConnection"
import { VeiculoModel } from "./Veiculo"

sequelize.sync({force: true});

export {
  VeiculoModel as Veiculo
}