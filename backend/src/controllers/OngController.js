const crypto = require('crypto');
const connection = require('../database/connection');

module.exports = {
  async create(req, res) {
    const { name, email, whatsapp, city, uf } = req.body

    const id = crypto.randomBytes(4).toString('HEX');

    await connection('ongs').insert({
      id,
      name,
      email,
      whatsapp,
      city,
      uf
    })

    return res.json({ id })
  },

  async index(req, res) {
    const ongs = await connection('ongs').select('*')

    return res.json(ongs)
  },

  async delete(req, res) {
    const { id } = req.params
    const ong_id = req.headers.authorization

    const ong = await connection('ongs').where('id', ong_id).select('id').first()

    if(ong_id != id) {
      return res.json({ error : 'Only the own Ong can delete yourself' })
    }

    if (!ong){
      return res.json({ error : 'Ong not found!' })
    }

    await connection('ongs').where('id', id).delete()

    return res.status(202).json({ msg : 'Ong deleted' })
  }
}