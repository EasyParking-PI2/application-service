import { DataType } from "sequelize-typescript";
import { sequelize } from "../infra/DatabaseConnection";
import { Vaga, Veiculo } from "./Models";
import { Model } from "sequelize";


class VeiculoVaga extends Model{
  declare id: string;
  declare valor: number;
  declare dataHoraEntrada: Date;
  declare dataHoraSaida: Date;

  calculateValue(entrada: Date, saida: Date){
    const diff = entrada.getTime() - saida.getTime();
    const diffHoras = diff / (1000 * 60 * 60);
    const valor = (diffHoras < 1)? 10 : diffHoras * 10;

    return valor;
  };
}

VeiculoVaga.init(
  {
    id: {
      type: DataType.UUID,
      primaryKey: true,
      defaultValue: DataType.UUIDV4
    },
    valor: {
      type: DataType.FLOAT,
      allowNull: true
    },
    dataHoraEntrada: {
      type: DataType.DATE,
      allowNull: false
    },
    dataHoraSaida: {
      type: DataType.DATE,
      allowNull: true
    }
  },
  {
    tableName: 'veiculo_vaga',
    timestamps: false,
    sequelize
  }
);


Veiculo.belongsToMany(Vaga, {through: {model: VeiculoVaga, unique: false}});
Vaga.belongsToMany(Veiculo, {through: {model: VeiculoVaga, unique: false}});

export {VeiculoVaga as VeiculoVagaModel};