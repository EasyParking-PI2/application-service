/*Banco de dados utilizado: MySQL 8.0.26*/

/*
Alunos:
Artur Macedo Guimaraes
Cassiano Medeiros Vieira Junior
Felix Wolter
*/
create database easyparking;

use easyparking;

create table usuario (
    id int primary key auto_increment,
    login varchar(100) not null,
    senha varchar(100) not null,
    nome varchar(100) not null,
    email varchar(100) not null,
    cpf varchar(11) not null,
    telefone varchar(11) not null,
    perfil ENUM("administrador", "caixa", "usuario")
);


CREATE TABLE veiculo (
    id INT PRIMARY KEY AUTO_INCREMENT,
    modelo VARCHAR(100) NOT NULL,
    marca VARCHAR(100) NOT NULL,
    placa VARCHAR(10) NOT NULL,
    categoria enum('carro', 'moto', 'caminhonete') NOT NULL,
    fk_usuario INT NOT NULL,
    FOREIGN KEY (fk_usuario) REFERENCES usuario(id)
);

create table vaga(
    id int primary key auto_increment,
    categoria enum('carro', 'moto', 'caminhonete') not null,
    status enum('disponivel', 'ocupada', 'interditada') not null
);

create table veiculo_vaga(
    id int primary key auto_increment,
    valor decimal(10,2),
    data_hora_entrada datetime not null,
    data_hora_saida datetime,
    fk_veiculo int not null,
    fk_vaga int not null,
    FOREIGN KEY (fk_veiculo) REFERENCES veiculo(id),
    FOREIGN KEY (fk_vaga) REFERENCES vaga(id)
);

/*inserindo dados*/
insert into usuario (login, senha, nome, email, cpf, telefone, perfil) values (
  'usuario1', '123', 'Usuario 1', 'usuario@email.com', '12345678901', '12345678901', 'usuario'
);

insert into usuario (login, senha, nome, email, cpf, telefone, perfil) values (
  'usuario2', '123', 'Usuario 2', 'usuario@email.com', '12345678901', '12345678901', 'usuario'
);

insert into usuario (login, senha, nome, email, cpf, telefone, perfil) values (
  'admin', '123', 'Administrador', 'admin@email.com', '12345678901', '12345678901', 'administrador'
);

insert into usuario (login, senha, nome, email, cpf, telefone, perfil) values (
  'caixa', '123', 'Caixa', 'caixa@email.com', '12345678901', '12345678901', 'caixa'
);

insert into veiculo (modelo, marca, placa, categoria, fk_usuario) values (
  'Gol', 'Volkswagen', 'ABC1234', 'carro', 1
);

insert into vaga (categoria, status) values (
  'carro', 'disponivel'
);

insert into veiculo_vaga (data_hora_entrada, fk_veiculo, fk_vaga) values (
  '2024-10-05 10:00:00', 1, 1
);

update vaga set status = 'ocupada' where id = 1;