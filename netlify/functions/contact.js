import nodemailer from 'nodemailer';

const JSON_HEADERS = { 'Content-Type': 'application/json; charset=utf-8' };

function respond(statusCode, body) {
  return { statusCode, headers: JSON_HEADERS, body: JSON.stringify(body) };
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return respond(405, { ok: false, error: 'Metoda neni povolena.' });
  }

  let data;
  try {
    data = JSON.parse(event.body || '{}');
  } catch {
    return respond(400, { ok: false, error: 'Neplatny format dat.' });
  }

  // Honeypot: a hidden field only bots fill in. Report success but skip sending.
  if (data._gotcha) {
    console.warn('Honeypot triggered (_gotcha field filled) – mail NOT sent.');
    return respond(200, { ok: true });
  }

  const name = (data.name || '').trim();
  const email = (data.email || '').trim();
  const phone = (data.phone || '').trim();
  const message = (data.message || '').trim();

  if (!name || !email || !message) {
    return respond(400, { ok: false, error: 'Vyplnte prosim jmeno, e-mail a zpravu.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return respond(400, { ok: false, error: 'Neplatny format e-mailu.' });
  }
  if (message.length > 5000 || name.length > 200) {
    return respond(400, { ok: false, error: 'Zprava je prilis dlouha.' });
  }

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.error('Missing SMTP env vars');
    return respond(500, { ok: false, error: 'Server neni spravne nakonfigurovany.' });
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // 465 = SSL; 587/25 = STARTTLS
    auth: { user, pass },
    // Fail fast instead of hanging when SMTP is unreachable.
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });

  const to = process.env.CONTACT_TO || user;
  const fromName = process.env.CONTACT_FROM_NAME || 'Web atelierkarczech.cz';

  const subject = `Nová poptávka z webu od ${name}`;

  const text = `Jméno: ${name}
E-mail: ${email}
Telefon: ${phone || '(neuvedeno)'}

Zpráva:
${message}
`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; color: #1c1714;">
      <h2 style="color:#c8a97e; margin: 0 0 16px;">Nová poptávka z webu</h2>
      <table style="border-collapse: collapse; width: 100%;">
        <tr><td style="padding: 6px 0; color:#74604e;">Jméno:</td><td style="padding: 6px 0;"><strong>${escapeHtml(name)}</strong></td></tr>
        <tr><td style="padding: 6px 0; color:#74604e;">E-mail:</td><td style="padding: 6px 0;"><a href="mailto:${escapeHtml(email)}" style="color:#c8a97e;">${escapeHtml(email)}</a></td></tr>
        <tr><td style="padding: 6px 0; color:#74604e;">Telefon:</td><td style="padding: 6px 0;">${escapeHtml(phone || '(neuvedeno)')}</td></tr>
      </table>
      <hr style="border: none; border-top: 1px solid #e4ddd3; margin: 20px 0;">
      <p style="white-space: pre-wrap; line-height: 1.6;">${escapeHtml(message)}</p>
    </div>
  `;

  try {
    await transporter.verify();
    const info = await transporter.sendMail({
      from: `"${fromName}" <${user}>`,
      to,
      replyTo: `"${name}" <${email}>`,
      subject,
      text,
      html,
    });
    console.log('Mail sent:', {
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
      response: info.response,
    });
    return respond(200, { ok: true });
  } catch (err) {
    console.error('SMTP error:', err);
    return respond(500, { ok: false, error: 'Mail se nepodařilo odeslat. Zkuste to prosím později.' });
  }
};
