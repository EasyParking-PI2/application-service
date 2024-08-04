import { DataTypes } from "sequelize";
import { sequelize } from "../infra/DatabaseConnection";

const Veiculo = sequelize.define(
  'Veiculo',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    modelo:{
      type: DataTypes.STRING,
      allowNull: false
    },
    marca: {
      type: DataTypes.STRING,
      allowNull: false
    },
    placa: {
      type: DataTypes.STRING,
      allowNull: false
    },
    categoria: {
      type: DataTypes.ENUM('carro', 'moto', 'caminhonete'),
      allowNull: false
    },
    dono: {
      type: DataTypes.UUID,
      allowNull: false
    }
  },
  {
    tableName: 'veiculos',
    timestamps: false
  }
);

export {Veiculo as VeiculoModel};