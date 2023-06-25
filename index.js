const core = require('@actions/core');
const yaml = require('js-yaml');
const axios = require('axios');
const github = require('@actions/github');

try {
  const title = core.getInput('title');
  const jobStatus = core.getInput('jobStatus');

  const json = {
    '@type': 'MessageCard',
    '@context': 'http://schema.org/extensions',
    themeColor: jobStatus === 'success' ? '00FF00' : 'FF0000',
    summary: 'MS Teams JSON Payload',
    title: title ,
    sections: [
      { text: '<h1><strong>Changelog</strong></h1>' },
      { text: '' },
      { text: '<h1><strong>Facts</strong></h1>' },
      { text: '<h1><strong>Workflow Steps</strong></h1>' }
    ],
    potentialAction: [
      {
        '@type': 'OpenUri',
        name: 'View commit',
        targets: [{ os: 'default', uri: 'https://test.com' }]
      }
    ]
  };

  const sectionsInput = core.getInput('sections');
  if (sectionsInput) {
    json.sections = yaml.load(sectionsInput);
  } else {

    const context = github.context;
    const repoOwner = context.repo.owner;
    const repoName = context.repo.repo;
    const commitSHA = context.sha;
    const lastCommit = core.getInput('lastCommit');
    json.sections[1].text = `Last commit: <a href="https://github.com/${ repoOwner }/${ repoName }/commit/${ commitSHA }">${ lastCommit }</a>`;

    const factsInput = core.getInput('facts');
    if (factsInput) {
      const facts = yaml.load(factsInput);
      json.sections[2].facts = facts.map(fact => {
        const name = Object.keys(fact)[0];
        return { name, value: fact[name] };
      });

      const factsTitleInput = core.getInput('factsTitle');
      if (factsTitleInput) {
        const factsTitle = yaml.load(factsTitleInput);
        json.sections[2].text = '<h1><strong>'+factsTitle+'</h1></strong>'
      }

      let steps = JSON.parse(core.getInput('steps'));
      const workflowSteps = Object.entries(steps).map(([key, value]) => ({
        name: key,
        value: value.outcome.replace('success', '✅ OK')
                            .replace('failure', '❌ FAIL')
                            .replace('skipped', '🐇 SKIP')
      }));
      json.sections[3].facts = workflowSteps
        
    }
  }

  const buttonsInput = core.getInput('buttons');
  if (buttonsInput) {
    const buttons = yaml.load(buttonsInput);
    json.potentialAction = buttons.map(button => ({
      '@type': button.type,
      name: button.name,
      targets: button.targets
    }));
  }

  const webhookUrl = core.getInput('webhook');

  axios.post(webhookUrl, json, { headers: { 'Content-Type': 'application/json' } })
    .then(response => {
      console.log('Solicitud enviada con éxito');
      console.log('Respuesta:', response.data);
    })
    .catch(error => {
      console.error('Error al enviar la solicitud:', error);
    });

  core.setOutput('jsonPayload', JSON.stringify(json, null, 2));
} catch (error) {
  core.setFailed(error.message);
}
