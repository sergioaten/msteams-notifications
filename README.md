# MS Teams Notifications

This GitHub action allows you to send notifications to Microsoft Teams from your GitHub workflows easily.

## Usage

To use this action, include the following step in your workflow:

```yaml
- name: MS Teams Notifications
  uses: <username>/<repository>@<tag>
  with:
    jobStatus: ${{ job.status }}
    title: ${{ github.workflow }} > ${{ github.ref_name }} (${{ github.run_number }})
    lastCommit: ${{ github.event.head_commit.message }}
    steps: <workflow-steps>
    factsTitle: <facts-title>
    facts: <facts>
    webhook: <Teams-webhook-URL>
    buttons: <buttons>
```

## Inputs

- `jobStatus` (required): Job status. Should be provided by the workflow.
- `title` (required): Title of the Teams message. Can contain GitHub context variables.
- `lastCommit` (required): Last commit message. Can contain GitHub context variables.
- `steps` (required): Workflow steps in JSON format.
- `factsTitle` (optional): Title of the facts in HTML format.
- `facts` (optional): Facts in YAML format.
- `webhook` (required): Teams webhook URL.
- `buttons` (optional): Buttons in YAML format.

## Outputs

- `jsonPayload`: JSON payload for Teams.

## Example

Here's an example of how to use this action in your workflow:

```yaml
on: [push]

jobs:
  example:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v2

      - name: Run tests
        id: test
        run: |
          # Run your tests here

      - name: Send MS Teams notification
        id: notification
        uses: sergioaten/msteams-notifications@v0.1-beta
        with:
          jobStatus: ${{ job.status }}
          title: ${{ github.workflow }} > ${{ github.ref_name }} (${{ github.run_number }})
          steps: ${{ toJson(steps) }}
          factsTitle: "Workflow Details"
          facts: |
            - Author: John Doe
            - Version: 1.0.0
          webhook: ${{ secrets.MS_TEAMS_WEBHOOK }}
          buttons: |
            - type: OpenUri
              name: View in GitHub
              targets:
                - os: default
                  uri: https://github.com/user/repo
```

**Note:** Make sure to replace `<username>/<repository>` and `<tag>` with the correct information for your action.

## Contribution

Contributions are welcome. If you have any improvements or encounter any issues, feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more information.
