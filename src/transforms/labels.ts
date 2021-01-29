import { json2xml, xml2js } from 'xml-js';

export const transformCustomLabels = (newLabels: string, oldLabels: string) => {
  const aJson = xml2js(newLabels, { compact: true }) as any;
  const bJson = xml2js(oldLabels, { compact: true }) as any;

  const indexesToRemove: number[] = [];
  aJson.CustomLabels.labels.forEach((label, i) => {
    const apiName = label.fullName._text;
    
    // xml2js converts to an object when there's only 1 custom label
    if(Array.isArray(bJson.CustomLabels.labels)){

      const match = bJson.CustomLabels.labels.find(bLabel => bLabel.fullName._text === apiName);
      if (match && JSON.stringify(match) === JSON.stringify(label)) {
        indexesToRemove.push(i);
      }
    }else {

      if (apiName === bJson.CustomLabels.labels.fullName._text) {
        indexesToRemove.push(i);
      }
    }
  });
  aJson.CustomLabels.labels = aJson.CustomLabels.labels.filter((l, i) => !indexesToRemove.includes(i) );

  if (aJson.CustomLabels.labels.length === 0) {
    return null;
  }
  return json2xml(aJson, { compact: true, spaces: 4 });
};
