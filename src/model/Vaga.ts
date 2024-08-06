import { sequelize } from "../infra/DatabaseConnection";
import { Association, BelongsToManyAddAssociationMixin, BelongsToManyCountAssociationsMixin, BelongsToManyGetAssociationsMixin, BelongsToManyHasAssociationMixin, BelongsToManyHasAssociationsMixin, BelongsToManyRemoveAssociationMixin, BelongsToManyRemoveAssociationsMixin, BelongsToManySetAssociationsMixin, DataTypes, HasManyAddAssociationMixin, HasManyAddAssociationsMixin, HasManyCountAssociationsMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasManyHasAssociationsMixin, HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, HasManySetAssociationsMixin, Model } from "sequelize";
import { Veiculo } from "./Models";

class Vaga extends Model{
  declare id: string;
  declare numero: number;
  declare categoria: string;
  declare status: string;

  declare getVeiculos: BelongsToManyGetAssociationsMixin<Veiculo>;
  declare addVeiculo: BelongsToManyAddAssociationMixin<Veiculo, string>;
  declare setVeiculos: BelongsToManySetAssociationsMixin<Veiculo, string>;
  declare removeVeiculo: BelongsToManyRemoveAssociationMixin<Veiculo, string>;
  declare removeVeiculos: BelongsToManyRemoveAssociationsMixin<Veiculo, string>;
  declare hasVeiculo: BelongsToManyHasAssociationMixin<Veiculo, string>;
  declare hasVeiculos: BelongsToManyHasAssociationsMixin<Veiculo, string>;
  declare countVeiculos: BelongsToManyCountAssociationsMixin;

  declare static associations:{
    veiculos: Association<Vaga, Veiculo>;
  }
}


Vaga.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    numero:{
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
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
    timestamps: false,
    sequelize
  },
);


export {Vaga as VagaModel};