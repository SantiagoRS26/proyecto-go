const New = require('../../models/news/new');
const { notifyAllWithNotifyGeneralImportantActive } = require('../notifications/notificationsController');
const User = require('../../models/user');

exports.createNews = async (req, res) => {
    const { title, summary, content, link, user } = req.body;
    
    try {
        const news = new New({ title, summary, content, link, user });
        const userById = await User.findById(user);
        await news.save();
        const noticeUrl = process.env.FRONTEND_URL + '/news/' + news._id;
        await notifyAllWithNotifyGeneralImportantActive({ newsTitle: title, newsContent: summary, newsUrl: noticeUrl,user:userById.name });
        res.status(201).json({ news });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

exports.createNewsWithOutResponse = async (req) => {
    const { title, summary, content, link, user } = req.body;
    
    try {
        const news = new New({ title, summary, content, link, user });
        const userById = await User.findById(user);
        await news.save();
        const noticeUrl = process.env.FRONTEND_URL + '/news/' + news._id;
        await notifyAllWithNotifyGeneralImportantActive({ newsTitle: title, newsContent: summary, newsUrl: noticeUrl,user:userById.name });
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

exports.getNews = async (req, res) => {
    try {
        const news = await New.find().sort({ createdAt: -1 });
        res.status(200).json({ news });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}
exports.getNewsById = async (req, res) => {
    const { newsId } = req.params;
    console.log(req.params);
    
    try {
        const news = await New.findById(newsId);
        if (!news) {
            return res.status(404).json({ error: "Noticia no encontrada" });
        }
        res.status(200).json({ news });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

exports.deleteNews = async (req, res) => {
    const { newsId } = req.params;
    try {
        await New.findByIdAndDelete(newsId);
        res.status(200).json({ message: "Noticia eliminada" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

exports.seedNew = async (req, res) => {
    try {
        const news = new New(
            { title: 'Cierre nocturno de calzada en el corredor Bogotá-Villavicencio por obras en viaducto', 
                summary: 'A partir de hoy y hasta el 15 de noviembre, se realizará el cierre nocturno de la calzada izquierda entre el km 54 y el km 58 del corredor Bogotá-Villavicencio', 
                content: `ColombiaDesde este miércoles y hasta el viernes 15 de noviembre, se llevará a cabo el cierre de la calzada izquierda entre los kilómetros 54 y 58 del corredor vial que conecta a Bogotá con Villavicencio. Las autoridades informaron que este cierre obedece a trabajos en los accesos al viaducto ubicado en el kilómetro 58, estructura que se encuentra en la fase final de su construcción y próxima a ser entregada. Para mitigar el impacto en la movilidad, se implementarán pasos alternos para los vehículos cada 15 minutos en ambos sentidos.
El cierre se realizará en horarios nocturnos para minimizar la afectación a los usuarios de la vía. Según la Resolución 4872 emitida el pasado 15 de octubre por el Instituto Nacional de Vías (Invías), el cierre se llevará a cabo de lunes a jueves, entre las 8:00 p.m. y las 5:00 a.m., y los viernes desde las 11:00 p.m. hasta las 5:00 a.m. del sábado. Durante estos periodos, los conductores que transiten hacia Bogotá o Villavicencio deberán esperar los intervalos de paso habilitados cada 15 minutos.

En cuanto al estado de la obra, el viaducto, que se construye en el kilómetro 58, cuenta con un avance físico del 96%. Los trabajos actuales se centran en la instalación de las barandas de seguridad, la iluminación y la capa de rodadura, componentes esenciales para garantizar una circulación segura y eficiente una vez se abra completamente al tránsito. Adicionalmente, se están ejecutando obras de protección en las pilas de apoyo 1 y 2 del viaducto, con el objetivo de prevenir posibles daños a las estructuras debido a la erosión del río Negro, el cual atraviesa el municipio de Guayabetal.

Esta infraestructura es clave para mejorar la movilidad y la seguridad en uno de los corredores viales más importantes del país, que conecta la región central con los llanos orientales. Según Invías, el nuevo viaducto beneficiará a más de 2.5 millones de personas que utilizan regularmente esta vía, facilitando el transporte de mercancías y pasajeros, y reduciendo los riesgos asociados a derrumbes o fallas geológicas en la zona. El proyecto forma parte de los esfuerzos del gobierno para mejorar la infraestructura vial en áreas críticas del país, con el fin de fortalecer la conectividad entre regiones y apoyar el desarrollo económico de los llanos orientales.`,
                link: 'https://caracol.com.co/2024/10/16/cierre-nocturno-de-calzada-en-el-corredor-bogota-villavicencio-por-obras-en-viaducto/', 
                user: '670b17696f4e2931c5f069bf' });
            await news.save();
            res.status(200).json({message:"Noticia creada"});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}