const db = require('../../../db');

class MembersController {

    constructor(router) {
        router.get('/', this.getMembers.bind(this));
        router.get('/:id', this.getMember.bind(this));
        router.post('/', this.insertMember.bind(this));
        router.put('/:id', this.updateMember.bind(this));
        router.delete('/:id', this.deleteMember.bind(this));
    }

    getMembers(req, res, next) {
        db.query('SELECT * FROM members', null, (err, result) => {
            if (err) {
                return next(err);
            }
            res.json(result.rows);
        });
    }

    getMember(req, res, next) {
        const id = req.params.id;
        db.query('SELECT * FROM members WHERE id=$1', [id], (err, result) => {
            if (err) {
                return next(err);
            }
            res.json(result.rows);
        });
    }

    insertMember(req, res, next) {
        const values = [
            req.body.firstName,
            req.body.lastName,
            req.body.sexe
        ];
        db.query('INSERT INTO members (first_name, last_name, sexe) VALUES ($1, $2, $3)', values, (err, result) => {
            if (err) {
                return next(err);
            }
            res.json(result.rows);
        });
    }

    updateMember(req, res, next) {
        const values = [
            req.params.id,
            req.body.firstName,
            req.body.lastName,
            req.body.sexe
        ];
        db.query('UPDATE members SET first_name=$2, last_name=$3, sexe=$4 WHERE id=$1', values, (err, result) => {
            if (err) {
                return next(err);
            }
            res.json(result.rows);
        });
    }

    deleteMember(req, res, next) {
        const id = req.params.id;
        db.query('DELETE FROM members WHERE id=$1', [id], (err, result) => {
            if (err) {
                return next(err);
            }
            res.json(result.rows);
        });
    }
}

module.exports = MembersController;