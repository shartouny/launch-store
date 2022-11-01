import axios from 'axios'
import FormData from 'form-data'
import formidable from 'formidable'
import fs from 'fs'

//disable default node parsing
export const config = {
  api: {
    bodyParser: false
  }
}

const install = async (req, res) => {
  //parse form data using formidable library
  const storeData = await new Promise((resolve, reject) => {
    const form = new formidable()

    form.parse(req, (err, fields, files) => {
      if (err) reject({ err })
      resolve({ err, fields, files })
    })
  })

  let storeName = storeData.fields.storeName.replace(/[^a-zA-Z ]/g, '')
  storeName = storeName.replace(/ /g, '-')

  let parentDir = `./public/attachments`

  if (!fs.existsSync(parentDir)) {
    fs.mkdirSync(parentDir)
  }

  let dir = `./public/attachments/${storeName}`

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }

  let data = new FormData()
  if (storeData?.files?.logo?.path) {
    const logo = fs.readFileSync(storeData.files.logo.path)
    if (logo) fs.writeFileSync(`./public/attachments/${storeName}/icon_${storeData.files.logo.name}`, logo)
    data.append('logo', `${req.headers.origin}/attachments/${storeName}/icon_${storeData.files.logo.name}`)
  } else {
    data.append('logo', '')
  }

  if (storeData?.files?.favIcon?.path) {
    const favIcon = fs.readFileSync(storeData.files.favIcon.path)
    if (favIcon) fs.writeFileSync(`./public/attachments/${storeName}/favIcon_${storeData.files.favIcon.name}`, favIcon)
    data.append('favIcon', `${req.headers.origin}/attachments/${storeName}/favIcon_${storeData.files.favIcon.name}`)
  } else data.append('favIcon', '')

  data.append('storeName', storeData.fields.storeName)

  data.append('fullName', storeData.fields.fullName)

  data.append('email', storeData.fields.email)

  data.append('phoneNumber', storeData.fields.phoneNumber)

  data.append('whiteLabelUrl', storeData.fields.whiteLabelUrl)

  data.append('whiteLabel', storeData.fields.whiteLabel)

  data.append('theme', storeData.fields.theme)

  try {
    let config = {
      method: 'post',
      url: process.env.NEXT_PUBLIC_TEELAUNCH_URL + '/launch/app/install',
      headers: {
        Authorization: req.headers.authorization,
        ...data.getHeaders()
      },
      data: data
    }

    axios(config)
      .then(function (response) {
        //remove images from the server
        //    fs.unlinkSync("./public/attachments/icon_" + data1.files.logo.name);
        //     fs.unlinkSync("./public/attachments/favIcon_" + data1.files.favIcon.name);

        res.status(200).json(response.data)
      })
      .catch(function (error) {
        //remove images from the server
        //  fs.unlinkSync("./public/attachments/icon_" + data1.files.logo.name);
        // fs.unlinkSync("./public/attachments/favIcon_" + data1.files.favIcon.name);

        res.status(400).json(error.data)
      })
  } catch (error) {
    res.status(400).json(error.data)
  }
}

export default install
