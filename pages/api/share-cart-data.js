import fs from 'fs'

const share = async (req, res) => {
  const dir = process.env.NEXT_PUBLIC_SHARED_CART_DIR
  if (req.method == 'POST') {
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
      }

      let storeDir = `${dir}/${req.body.slug}`
      if (!fs.existsSync(storeDir)) {
        fs.mkdirSync(storeDir)
      }

      let filename = req.body.hash + '.json'
      if (!fs.existsSync(`${storeDir}/${filename}`)) {
        fs.writeFileSync(`${storeDir}/${filename}`, req.body.data)
      }
      return res.status(200).json({ message: 'success' })
    } catch (e) {
      return res.status(404).json({ error: 'went wrong, please try again later' })
    }
  } else {
    let file = `${dir}/${req.query.slug}/${req.query.hash}.json`
    if (fs.existsSync(file)) {
      return res.status(200).json(fs.readFileSync(file, 'utf8'))
    } else {
      return res.status(404).json({ error: 'Cart Link is expired' })
    }
  }
}

export default share
