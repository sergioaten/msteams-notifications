# MS Teams Notifications

This GitHub action allows you to send notifications to Microsoft Teams from your GitHub workflows easily.

## Usage

To use this action, include the following step in your workflow (see inputs and examples for more information):

```yaml
- name: MS Teams Notifications
  uses: sergioaten/msteams-notifications@v0.1-beta
  with:
    steps: ${{ toJson(steps) }}
    factsTitle: <facts-title>
    facts: <facts yaml format>
    webhook: <Teams-webhook-URL>
    buttons: <buttons yaml format>
```

See [Microsoft Docs](https://learn.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/connectors-using?tabs=cURL) for more information on building the YAML objects.

## Inputs

| Input        | Description                                                                | Required | Default value                                                              |
| ------------ | -------------------------------------------------------------------------- | -------- | -------------------------------------------------------------------------- |
| `title`      | Title of the Teams message.                                                | No       | ${{ github.workflow }} > ${{ github.ref_name }} (${{ github.run_number }}) |
| `steps`      | Workflow steps in JSON format. Recommendation: ${{ toJson(steps) }}        | No       | -                                                                          |
| `factsTitle` | Title of the facts. Supports HTML                                          | No       | Facts                                                                      |
| `facts`      | Facts in YAML format.                                                      | No       | -                                                                          |
| `sections`   | Overwrite steps & facts and you can build your custom section as you want. | No       | -                                                                          |
| `webhook`    | Teams webhook URL.                                                         | Yes      | -                                                                          |
| `buttons`    | Buttons in YAML format.                                                    | No       | -                                                                          |
| `dry_run`    | Dont send notification if true. Default is false.                          | No       | false                                                                      |

## Outputs

- `jsonPayload`: JSON payload for Teams.

## Examples

Here are examples of how to use this action in your workflow:

### Example 1

```yaml
- name: Send MS Teams notification
  id: notification
  if: always()
  uses: sergioaten/msteams-notifications@v0.1-beta
  with:
    webhook: ${{ secrets.MSTEAMS_WEBHOOK }}
```

![Example 1](https://i.imgur.com/O7xRTPi.png)

### Example 2

```yaml
- name: Send MS Teams notification
  id: notification
  if: always()
  uses: sergioaten/msteams-notifications@v0.1-beta
  with:
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

![Example 2](https://i.imgur.com/sxINtZ1.png)

### Example 3

```yaml
- name: Send MS Teams notification
  id: notification
  if: always()
  uses: sergioaten/msteams-notifications@v0.1-beta
  with:
    webhook: ${{ secrets.MSTEAMS_WEBHOOK }}
    sections: |
      - text: This is a test with a test section
        facts:
          - name: This is a test fact nº1
            value: This is the value nº1
          - name: This is a test fact nº2
            value: This is the value nº2
      - text: <h1><i><strong>do you want more? you can use HTML! :)</h1></i></strong>
```

![Example 3](https://i.imgur.com/0KoJuqF.png)

## Contribution

Contributions are welcome. If you have any improvements or encounter any issues, feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more information.
