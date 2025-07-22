import Ai from '@cloudflare/ai';

export const runModel = async (model, inputs) => {
    const ai = new Ai(global.env.AI);
    const response = await ai.run(model, inputs);
    return response;
};
