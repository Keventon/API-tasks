export async function json(request, response) {
  const buffers = [];

  //Aguarda recuperar todos os dados para ir para a próxima linha
  for await (const chunk of request) {
    buffers.push(chunk);
  }

  request.rawBody = Buffer.concat(buffers).toString();

  try {
    request.body = JSON.parse(request.rawBody);
  } catch {
    request.body = null;
  }

  response.setHeader("Content-Type", "application/json");
}
