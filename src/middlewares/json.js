export async function json(request, response) {
  const buffers = [];

  //Aguarda recuperar todos os dados para ir para a próxima linha
  for await (const chunk of request) {
    buffers.push(chunk);
  }

  try {
    request.body = JSON.parse(Buffer.concat(buffers).toString());
  } catch {
    request.body = null;
  }

  response.setHeader("Content-Type", "application/json");
}
