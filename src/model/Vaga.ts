import { DataTypes } from "sequelize";
import { sequelize } from "../infra/DatabaseConnection";

const Vaga = sequelize.define(
  'Vaga',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    numero:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
    categoria:{
      type: DataTypes.ENUM('carro', 'moto', 'caminhonete'),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('disponivel', 'ocupada', 'interditada'),
      allowNull: false
    }
  },
  {
    tableName: 'vagas',
    timestamps: false
  }
);

export {Vaga as VagaModel};