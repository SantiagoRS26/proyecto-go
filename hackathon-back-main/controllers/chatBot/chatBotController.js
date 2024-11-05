require('dotenv').config();
const OpenAI = require('openai');
const PicoyPlacaDaily = require("../../models/traffic-restrictions/picoyplacaDaily");
const Decree = require("../../models/traffic-restrictions/decrees");
const PicoyPlacaSpecialDays = require("../../models/traffic-restrictions/PicoyPlacaSpecialDay");
const moment = require('moment-timezone');
const { createNewsWithOutResponse } = require('../generalImportantNews/newsController');
const { AddSpecialDayWithOutResponse } = require('../traffic-restrictions/trafficRestrictionsController');
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const handleChatbotRequest = async (req, res) => {
  const { question } = req.body;
  console.log('Pregunta:', question);

  const allowedKeywords = ['multas', 'movilidad', 'leyes', 'precios', 'villavicencio', 'multa','pico y placa','festivo','dia sin'];
  const isRelatedToMobility = allowedKeywords.some(keyword => {
    console.log('Keyword:', keyword);
    console.log('Question', question.toLowerCase().includes(keyword));
    console.log('Question:', question.toLowerCase()); 
    return question.toLowerCase().includes(keyword)
  });

  if (!isRelatedToMobility) {
    return res.status(200).json({ message: 'Por favor, haz preguntas relacionadas con la movilidad.' });
  }

  try {
    const lastDecree = await Decree.findOne().sort({ createdAt: -1 });
    const picoyPlacaDaily = await PicoyPlacaDaily.find({ decree: lastDecree._id });
    const picoyPlacaSpecialDays = await PicoyPlacaSpecialDays.find();
    const picoyPlacaSpecialDaysJSON = JSON.stringify(picoyPlacaSpecialDays);
    const picoyPlacaJSON = JSON.stringify(picoyPlacaDaily);
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Responde solo preguntas relacionadas con la movilidad en Villavicencio, Meta, Colombia. Precisas y con la información solicitada sobre movilidad, adicionalmente este es el JSON de nuestra base de datos de pico y placa.' },
        { role: 'user', content: question },
        {role: 'system', content: `toda pregunta relacionada a pico y placa, días festivos y especiales, tomarlas de los JSON suministrados` },
        { role: 'system', content: `Aquí está la información de pico y placa: ${picoyPlacaJSON}` },
        {role : 'system', content: `Aquí está la información de los días especiales, aquellos que quitan el pico y placa, según el tipo de vehiculo: ${picoyPlacaSpecialDaysJSON}`},
        {role: 'system', content: `Hoy es ${moment().tz('America/Bogota').toDate()}`}
      ],
    });

    const fullResponse = response.choices[0].message.content;
    res.json({ message: fullResponse });
  } catch (error) {
    console.error('Error:', error);
    res.status(200).json({ message: 'Estamos teniendo problemas, por favor intente más tarde' });
  }
};

const AdminHelperBot = async (req, res) => {
  try {
    const { helperRequest, userid } = req.body;
    console.log('Pregunta:', helperRequest);
    
    if (!helperRequest) {
      return res.status(200).json({ message: "No se ha proporcionado una pregunta." });
    }

    const newsKeywords = ['noticia', 'noticias'];
    const specialDayKeywords = ['festivo', 'especial'];

    const isNewsRelated = newsKeywords.some(keyword => helperRequest.toLowerCase().includes(keyword));
    const isSpecialDayRelated = specialDayKeywords.some(keyword => helperRequest.toLowerCase().includes(keyword));
    
    if (isNewsRelated) {
      const newsSchema = `{
        "gptInformationIsComplete": "Boolean",
        "gpt3Response": "String",
        "data": {
          "title": "String",
          "summary": "String",
          "content": "String",
          "link": "String (optional)"
        }
      }`;  
      const schemaPrompt = `
        A continuación tienes el esquema de respuesta que necesito:
        ${newsSchema}
        Devuelve únicamente un objeto JSON que siga estrictamente este esquema. No incluyas ningún texto fuera del objeto JSON.
      `;
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Responde estrictamente en formato JSON de acuerdo al siguiente esquema:' },
          { role: 'system', content: 'No inventes información' },
          { role: 'system', content: schemaPrompt },
          { role: 'user', content: helperRequest }
        ],
      });
      
      const fullResponse = response.choices[0].message.content;
      
      const isJSONResponse = fullResponse.startsWith("{") || fullResponse.startsWith("[");
      if (isJSONResponse) {
        const jsonResponse = JSON.parse(fullResponse);
        console.log('JSON:', jsonResponse);
        
        if (!jsonResponse.data.title || !jsonResponse.data.summary || !jsonResponse.data.content) {
          return res.status(200).json({ message: jsonResponse.gpt3Response || "Ha ocurrido un error en la creación, intente más tarde" });
        }
        const news = { title: jsonResponse.data.title, summary: jsonResponse.data.summary, content: jsonResponse.data.content, link: jsonResponse.data.link, user: userid };

        
        const resp = await createNewsWithOutResponse({ body: news });
        if (!resp) {
          return res.status(200).json({ message: "Ha ocurrido un error en la creación, intente más tarde" });
        }
      }else{
        return res.json({ message: "Ha ocurrido un error en la creación, intente más tarde" });
      }
      return res.json({ message: "Noticia creada y notificada" });
    }

    if (isSpecialDayRelated) {
      const specialDaySchema = `{
        "gptInformationIsComplete": "Boolean",
        "gpt3Response": "String",
        "data": {
          "date": "Date", 
          "reason": "String", 
          "vehicleType": "String (publicVehicle, privateVehicle, heavyVehicle, motorcycle)"
        }
      }`;
      
      const schemaPrompt = `
        A continuación tienes el esquema de respuesta que necesito:
        ${specialDaySchema}
        Devuelve únicamente un objeto JSON que siga estrictamente este esquema. No incluyas ningún texto fuera del objeto JSON.
      `;
      
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Responde estrictamente en formato JSON de acuerdo al siguiente esquema:' },
          { role: 'system', content: 'No inventes información' },
          { role: 'system', content: schemaPrompt },
          { role: 'user', content: helperRequest }
        ],
      });
      
      const fullResponse = response.choices[0].message.content;

      const isJSONResponse = fullResponse.startsWith("{") || fullResponse.startsWith("[");
      if (isJSONResponse) {
        const jsonResponse = JSON.parse(fullResponse);
        if (!jsonResponse.data.date || !jsonResponse.data.reason || !jsonResponse.data.vehicleType) {
          return res.status(200).json({ message: jsonResponse.gpt3Response || "Ha ocurrido un error en la creación, intente más tarde" });
        }
        const specialDay = { date: jsonResponse.data.date, reason: jsonResponse.data.reason, vehicleType: jsonResponse.data.vehicleType };
        const resp = await AddSpecialDayWithOutResponse({ body: specialDay });
        if (!resp) {
          return res.status(200).json({ message: "Ha ocurrido un error en la creación, intente más tarde" });
        }
      }else{
        return res.json({ message: "Ha ocurrido un error en la creación, intente más tarde" });
      }
      return res.json({ message: "Día festivo / exento de pico y placa creado y notificado" });
    }

    return res.json({ message: "Este chat bot es específico para ayudar a los administradores a crear noticias o días festivos de una forma más rápida" });

  } catch (error) {
    return res.status(500).json({ message: "Ha ocurrido un error en el servidor", error: error.message });
  }
};


module.exports = {
  handleChatbotRequest,
  AdminHelperBot
};
