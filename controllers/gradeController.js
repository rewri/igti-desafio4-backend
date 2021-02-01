import { db } from '../models/index.js';
import { logger } from '../config/logger.js';
import { gradeModel } from "../models/gradeModel.js";

const create = async (req, res) => {
    try {

        const grade = new gradeModel(req.body);
        if (await grade.save()) {
            res.send({ message: 'Grade inserido com sucesso' });
        } else {
            res.status(500).send("Erro ao criar");
        }
        
        logger.info(`POST /grade - ${JSON.stringify()}`);
    } catch (error) {
        res
            .status(500)
            .send({ message: error.message || 'Algum erro ocorreu ao salvar' });
        logger.error(`POST /grade - ${JSON.stringify(error.message)}`);
    }
};

const findAll = async (req, res) => {

    const name = req.query.name;

    var condition = name
        ? { name: { $regex: new RegExp(name), $options: 'i' } }
        : {};

    try {
        
        logger.info(`GET /grade`);

        const grades = await gradeModel.find(condition);

        if (!grades) {
            res.send(404).send("Não encontrado");
        } else {
            res.status(200).send(grades);
        }

    } catch (error) {
        res
            .status(500)
            .send({ message: error.message || 'Erro ao listar todos os documentos' });
        logger.error(`GET /grade - ${JSON.stringify(error.message)}`);
    }
};

const findOne = async (req, res) => {

    const id = req.params.id;

    try {
        const grade = await gradeModel.findById({ _id: id });
        if (!grade) {
            res.send(404).send("Não encontrado");
        } else {
            res.status(200).send(grade);
        }
        logger.info(`GET /grade - ${id}`);
    } catch (error) {
        res.status(500).send({ message: 'Erro ao buscar o Grade id: ' + id });
        logger.error(`GET /grade - ${JSON.stringify(error.message)}`);
    }
};

const update = async (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: 'Dados para atualizacao vazio',
        });
    }

    const id = req.params.id;

    try {

        const id = req.params.id;
        const grade = await gradeModel.findByIdAndUpdate({ _id: id }, req.body, { new: true });
        if (!grade) {
            res.send(404).send("Não encontrado");
        } else {
            res.status(201).send(grade);
        }

        logger.info(`PUT /grade - ${id} - ${JSON.stringify(req.body)}`);
    } catch (error) {
        res.status(500).send({ message: 'Erro ao atualizar a Grade id: ' + id });
        logger.error(`PUT /grade - ${JSON.stringify(error.message)}`);
    }
};

const remove = async (req, res) => {
    const id = req.params.id;

    try {

        const grade = await gradeModel.findByIdAndDelete({ _id: id });
        if (!grade) {
            res.send(404).send("Não encontrado");
        } else {
            res.status(200).send("Excluído");
        }

        logger.info(`DELETE /grade - ${id}`);
    } catch (error) {
        res
            .status(500)
            .send({ message: 'Nao foi possivel deletar o Grade id: ' + id });
        logger.error(`DELETE /grade - ${JSON.stringify(error.message)}`);
    }
};

const removeAll = async (req, res) => {
    try {

        const grade = await gradeModel.deleteMany({});
        if (!grade) {
            res.send(404).send("Não encontrado");
        } else {
            res.status(200).send("Excluído");
        }

        logger.info(`DELETE /grade`);
    } catch (error) {
        res.status(500).send({ message: 'Erro ao excluir todos as Grades' });
        logger.error(`DELETE /grade - ${JSON.stringify(error.message)}`);
    }
};

export default { create, findAll, findOne, update, remove, removeAll };
