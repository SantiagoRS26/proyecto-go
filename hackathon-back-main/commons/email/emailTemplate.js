exports.generateEmailContent = (zone, reportType, longitude, latitude) => {
  const iconUrl = reportType.icons.icon_small;
  let marker;

  if (iconUrl) {
    marker = `url-${encodeURIComponent(iconUrl)}(${longitude},${latitude})`;
  } else {
    marker = `pin-s+555555(${longitude},${latitude})`;
  }

  const mapImage = `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/${marker}/${longitude},${latitude},${12},0,0/${300}x${200}?access_token=${
    process.env.MAPBOX_TOKEN
  }`;

  const subject = `Nuevo reporte en zona de interés (${reportType.type})`;
  const textContent = `Se ha reportado un ${reportType.type} en tu zona de interés ${zone.name}`;
  const htmlContent = `
      <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px;">
    <h2 style="color: #4CAF50; text-align: center;">Nuevo reporte en tu zona de interés</h2>
    <p style="font-size: 16px; line-height: 1.6;">
      Se ha reportado un <strong style="color: #333;">${reportType.type}</strong> en tu zona de interés: <strong>${zone.name}</strong>.
    </p>
    <div style="text-align: center; margin: 20px 0;">
      <img src="${mapImage}" alt="Mapa del reporte" style="width: 100%; max-width: 300px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);" />
    </div>
    <p style="font-size: 14px; line-height: 1.6; color: #555;">
      Puedes revisar más detalles sobre este reporte en tu cuenta o contactarnos si tienes alguna duda.
    </p>
    <p style="font-size: 14px; color: #777; text-align: center; margin-top: 30px;">
      Gracias por usar nuestra plataforma de reportes.
    </p>
    <footer style="text-align: center; font-size: 12px; color: #999; margin-top: 20px;">
      <p>Este es un correo generado automáticamente, por favor no respondas a este mensaje.</p>
    </footer>
  </div>
    `;

  return { subject, textContent, htmlContent };
};

exports.generateEmailUpdatePicoyPlacaContent = (dynamicUrl) => {
  const html = `<div style="background-color:#fff;border-radius:8px;box-shadow:0 4px 8px rgba(0,0,0,0.1);max-width:400px;width:100%;padding:20px;box-sizing:border-box;text-align:center;">
      <h1 style="font-size:1.5rem;color:#1f2937;margin-bottom:10px;">¡¡¡NUEVO PICO Y PLACA!!!</h1>
      <p style="font-size:1rem;color:#4b5563;margin-bottom:20px;">Se ha actualizado el pico y placa, revíselo en:</p>
      <a href="${dynamicUrl}" target="_blank" style="display:inline-block;background-color:#4f46e5;color:#fff;padding:10px 20px;border-radius:4px;text-decoration:none;font-weight:bold;">Ir a restricciones</a>
    </div>`;
  const subject = `¡¡¡NUEVO PICO Y PLACA!!!`;
  const text = `Se ha actualizado el pico y placa, revíselo en: ${dynamicUrl}`;
  return { subject, text, html };
}
exports.generateEmailContentNewSpecialDay = (specialDay, date, vehicleType) => {
  const html = `
    <div style="background-color:#fff;border-radius:8px;box-shadow:0 4px 8px rgba(0,0,0,0.1);max-width:600px;width:100%;padding:20px;box-sizing:border-box;text-align:center;">
      <h1 style="font-size:1.5rem;color:#1f2937;margin-bottom:10px;">¡Día Especial Anunciado!</h1>
      <p style="font-size:1rem;color:#4b5563;margin-bottom:20px;">El día <strong>${specialDay}</strong> (${date}) ha sido marcado como un día especial para vehículos de tipo <strong>${vehicleType}</strong>.</p>
      <p style="font-size:1rem;color:#4b5563;margin-bottom:20px;">No habrá pico y placa en esta fecha para este tipo de vehículo.</p>
      <p style="font-size:1rem;color:#4b5563;margin-bottom:20px;">Revisa los detalles adicionales en tu cuenta o contacta con nosotros para más información.</p>
    </div>`;

  const subject = `¡Nuevo día especial para ${vehicleType}!`;
  const text = `El día ${specialDay} (${date}) ha sido marcado como un día especial para vehículos de tipo ${vehicleType}. No habrá pico y placa en esta fecha. Revisa más detalles en tu cuenta o contacta con nosotros.`;

  return { subject, text, html };
};

exports.generateEmailContentMobilityNews = (newsTitle, newsContent, newsUrl, createdByUser) => {
  const html = `
    <div style="background-color:#ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); max-width: 600px; width: 100%; padding: 20px; box-sizing: border-box; text-align: center;">
      <h1 style="font-size: 1.8rem; color: #1f2937; margin-bottom: 15px;">¡Nueva Noticia de Movilidad!</h1>
      <p style="font-size: 1.2rem; color: #4b5563; margin-bottom: 20px;">${newsTitle}</p>
      <p style="font-size: 1rem; color: #4b5563; margin-bottom: 20px;">${newsContent}</p>
      <p style="font-size: 0.9rem; color: #6b7280; margin-bottom: 20px;">Creado por: <strong>${createdByUser}</strong></p>
      <a href="${newsUrl}" target="_blank" style="display: inline-block; background-color: #4f46e5; color: #ffffff; padding: 12px 24px; border-radius: 4px; text-decoration: none; font-weight: bold; margin-top: 15px;">Leer más</a>
      <footer style="font-size: 0.85rem; color: #999; margin-top: 30px;">
        <p>Gracias por mantenerte informado sobre la movilidad en Villavicencio.</p>
        <p>Este es un correo generado automáticamente, por favor no respondas a este mensaje.</p>
      </footer>
    </div>
  `;

  const subject = `Nueva noticia sobre movilidad: ${newsTitle}`;
  const text = `${newsTitle}\n\n${newsContent}\n\nCreado por: ${createdByUser}\n\nPuedes leer más en el siguiente enlace: ${newsUrl}`;

  return { subject, text, html };
};
