export function buildOpenAICoverPrompt(prompt, negativePrompt) {
  const basePrompt = String(prompt ?? "").trim();
  const bannedTextInstruction = "Strictly no text, letters, words, logos, signatures, watermark.";
  const avoidPrompt = String(negativePrompt ?? "").trim();

  if (!avoidPrompt) {
    return `${basePrompt}. ${bannedTextInstruction}`;
  }

  return `${basePrompt}. Avoid: ${avoidPrompt}. ${bannedTextInstruction}`;
}

export function resolveOutputFormat(filePath) {
  return /\.jpe?g$/i.test(String(filePath ?? "")) ? "jpeg" : "png";
}
