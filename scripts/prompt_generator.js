async function queryChatbot(prompt) {
    const apiKey = 'api_key'; //api key
    const endpoint = 'https://api.openai.com/v1/chat/completions';
  
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    };
  
    const data = {
      'prompt': prompt,
      'max_tokens': 50,
      'temperature': 0.7,
      'n': 1
    };
  
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data)
    });
  
    const responseJson = await response.json();
    if (responseJson.choices && responseJson.choices.length > 0) {
      return responseJson.choices[0].text.trim();
    } else {
      return null;
    }
}
  

const prompt = "What is the meaning of life?";
queryChatbot(prompt)
    .then(response => console.log(response))
    .catch(error => console.error(error));
  