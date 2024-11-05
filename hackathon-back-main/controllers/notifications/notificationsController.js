const emailSender = require('../../commons/email/emailSender');
const User = require('../../models/user');
const { generateEmailContentMobilityNews } = require('../../commons/email/emailTemplate');
exports.sendEmailBack = async (to, subject, text, html) => {
  try {
    /*const info = await transporter.sendMail({
      from: `"Nombre del remitente" <${process.env.EMAIL_USER}>`, 
      to,
      subject,
      text,
      html
    });*/
    
    console.log('Correo enviado: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error enviando el correo:', error);
    throw error;
  }
}


exports.sendMail = async (req, res) => {
  const { to, subject, text, html } = req.body;
  try {
    const info = await emailSender.sendEmail(to, subject, text, html);
    res.status(200).json({ info });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

exports.notifyAllWithTrafficRestrictionActive = async (req, res) => {
  try {
    notifyAllWithTrafficRestrictionActiveService(req.body);    
    res.status(200).json({ message: 'Emails sent' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const notifyAllWithTrafficRestrictionActiveService = async (req) => {
  try {
    const { subject, text,html } = req;
    const usersWithNotifyActive = await User.find({ notifyTrafficDecree: true });
    const emails = usersWithNotifyActive.map((user) => user.email);
    await emailSender.sendMultipleEmails(emails, subject, text,html);
    return true;
  } catch (error) {
    return false;
  }
}

exports.notifyAllWithTrafficRestrictionActiveService = async (req) => {
  await notifyAllWithTrafficRestrictionActiveService(req);
}

exports.notifyAllWithNotifyGeneralImportantActive = async (req) => {
  try {
    const {newsTitle, newsContent,newsUrl,user} = req;
    console.log(req);
    
    const usersWithNotifyActive = await User.find({ notifyGeneralImportant: true });
    console.log(usersWithNotifyActive);
    
    const emails = usersWithNotifyActive.map((user) => user.email);
    console.log(emails);
    
    const {subject, text, html} = generateEmailContentMobilityNews(newsTitle, newsContent, newsUrl,user);
    console.log(emails, subject, text, html);
    
    await emailSender.sendMultipleEmails(emails, subject, text,html);
    return true;
  } catch (error) {
    return false;
  }
}

exports.getNotifyPermissions = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ _id: userId });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      notifyTrafficDecree: user.notifyTrafficDecree,
      notifyReportsOnInterestZones: user.notifyReportsOnInterestZones,
      notifyGeneralImportant: user.notifyGeneralImportant,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
exports.modifyNotifyPermissions = async (req, res) => {
  try {
    const {userId} = req.params;
    const { notifyTrafficDecree, notifyReportsOnInterestZones, notifyGeneralImportant } = req.body;
    const user = await User.findOne({ _id : userId });
    user.notifyTrafficDecree = notifyTrafficDecree;
    user.notifyReportsOnInterestZones = notifyReportsOnInterestZones;
    user.notifyGeneralImportant = notifyGeneralImportant;
    await user.save();
    res.status(200).json({ message: 'Permissions updated' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}