import { sequelize } from "../infra/DatabaseConnection"
import { VeiculoModel } from "./Veiculo"

sequelize.sync();

export {
  VeiculoModel as Veiculo
}