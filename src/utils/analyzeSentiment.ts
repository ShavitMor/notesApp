import fetch from 'node-fetch';
import FormData from 'form-data';

//func to analyze sentiment of a text
export const analyzeSentiment = async (text: string) => {

    
    const formdata = new FormData();

    formdata.append("key", process.env.MEANINGCLOUD_API_KEY);
    formdata.append("txt", text);
    formdata.append("lang", "en"); 

  const requestOptions = {
    method: 'POST',
    body: formdata,
    redirect: 'follow' as RequestRedirect
  };
  try {
   
    const response = await fetch("https://api.meaningcloud.com/sentiment-2.1", requestOptions);
    const data = await response.json();
    
    //my desired format, used it because this is the format used in the offical site
    const sentimentResults = data.sentence_list.map((sentence: any) => {
      return {
        level: "Sentence",
        text: sentence.text,
        "score tag": sentence.score_tag,
        agreement: sentence.agreement,
        confidence: sentence.confidence,
      };
    });
    return sentimentResults;

  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    throw error;
  }
};
export default analyzeSentiment;    


