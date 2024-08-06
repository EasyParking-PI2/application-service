import { sequelize } from "../infra/DatabaseConnection"
import { VeiculoModel } from "./Veiculo"
import { VagaModel } from "./Vaga";
import { VeiculoVagaModel } from "./VeiculoVaga";

sequelize.sync();

export {
  VeiculoModel as Veiculo,
  VagaModel as Vaga,
  VeiculoVagaModel as VeiculoVaga
}