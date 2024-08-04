import { sequelize } from "../infra/DatabaseConnection"
import { VeiculoModel } from "./Veiculo"
import { VagaModel } from "./Vaga";

sequelize.sync();

export {
  VeiculoModel as Veiculo,
  VagaModel as Vaga
}