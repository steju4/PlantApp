import axios from 'axios';

const FREEPIK_API_URL = 'https://api.freepik.com/v1/ai/text-to-icon';
const API_KEY = '<your-api-key>';

export const fetchFreepikIcon = async (prompt: string) => {
  try {
    const response = await axios.post(
      FREEPIK_API_URL,
      {
        prompt: prompt,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-freepik-api-key': "FPSX7aa34f17d16147acbe364a5cedc860c9",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching icon:', error);
    throw error;
  }
};
