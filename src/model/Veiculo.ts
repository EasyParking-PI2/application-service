import { sequelize } from "../infra/DatabaseConnection";
import { Association, BelongsToManyAddAssociationMixin, BelongsToManyCountAssociationsMixin, BelongsToManyGetAssociationsMixin, BelongsToManyHasAssociationMixin, BelongsToManyHasAssociationsMixin, BelongsToManyRemoveAssociationMixin, BelongsToManyRemoveAssociationsMixin, BelongsToManySetAssociationsMixin, DataTypes, HasManyAddAssociationMixin, HasManyCountAssociationsMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasManyHasAssociationsMixin, HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, HasManySetAssociationsMixin, Model } from "sequelize";
import { Vaga } from "./Models";

class Veiculo extends Model{
  declare id: string;
  declare modelo: string;
  declare marca: string;
  declare placa: string;
  declare categoria: string;
  declare dono: string;

  declare getVagas: BelongsToManyGetAssociationsMixin<Vaga>;
  declare addVagas: BelongsToManyAddAssociationMixin<Vaga, string>;
  declare setVagas: BelongsToManySetAssociationsMixin<Vaga, string>;
  declare removeVaga: BelongsToManyRemoveAssociationMixin<Vaga, string>;
  declare removeVagas: BelongsToManyRemoveAssociationsMixin<Vaga, string>;
  declare hasVaga: BelongsToManyHasAssociationMixin<Vaga, string>;
  declare hasVagas: BelongsToManyHasAssociationsMixin<Vaga, string>;
  declare countVagas: BelongsToManyCountAssociationsMixin;


  declare static associations:{
    vagas: Association<Veiculo, Vaga>;
  }
}

Veiculo.init({
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
    allowNull: false,
    unique: true
  },
  categoria: {
    type: DataTypes.ENUM('carro', 'moto', 'caminhonete'),
    allowNull: false
  },
  dono: {
    type: DataTypes.UUID,
    allowNull: false
  }
},{
  tableName: 'veiculos',
  timestamps: false,
  sequelize
});

export {Veiculo as VeiculoModel};