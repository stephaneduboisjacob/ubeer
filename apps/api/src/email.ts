export type MailMessage = { to: string; subject: string; text: string };
export type MailTransport = { send(message: MailMessage): Promise<void> };

const consoleTransport: MailTransport = {
  async send(message) {
    process.stdout.write(`${JSON.stringify({ transport: "console", ...message })}\n`);
  },
};

let activeTransport: MailTransport = consoleTransport;

export function setMailTransport(transport: MailTransport): void {
  activeTransport = transport;
}

export function sendMail(message: MailMessage): Promise<void> {
  return activeTransport.send(message);
}
