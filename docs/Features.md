Features
================

[← API Design](ApiDesign.md) | [ToC ↑](../README.md) | [Integrations →](Integrations.md)


## Notes

The notes are stored as a set of relational records in the database. `rvn_notes` contains versioned note entries (there might be more than one per note, each corresponding to a note version, grouped by the same `root_version_id`), and then each note version has its own set of groups (`rvn_note_field_groups`), and then fields are set within those (`rvn_note_fields`). This is where the value is actually stored in the plain text format inside `value` column.

The note system is used for both notes (obviously) and Due Dilligence workflow system. For that purpose, there is also an additional `rvn_note_tabs` that groups the fields together in a taggable tabs. Please note, that for all purposes, both systems are fundamentally the same, and their main difference is how they are presented within the UI.

## Company sourcing

The companies are sourced from two important integrations: Affinity and Data Warehouse. We can also add them manually. The `initial_data_source` column indicates the initial source of the company.

## Tagging system

The tagging system is a mechanism widely spread in our application. The very basics of that system are based on the `rvn_tags` tags, which contains tags of different types:
* `company` tags, created as a side effect of creating a company
* `people` tags, created as a side effect of creating a user
* `opportunity` tags, which is a fixed set of tags corresponding to different funding round names
* `version` tags, which are a custom set of tags created to denote custom opportunities for given organisations
* `tab` tags, which are created as a side effect of creating tabs in the Due Dilligence templates
* `investor` tags, which are pre-seeded and fixed list of investors
* `industry` tags, which denote the industry of the company
* `business-model` tags, which denote the business model of the company

There is a possibility to tag notes (and possibly other data that we have in the system) with those tags. The tags are then used for filtering and searching purposes.

On top of that, for some situations we build so-called complex tags, which are a combination of few tags. The best example is a combo of `company` and `oppurtunity` tags, which is used to denote the funding round of a company. Same goes for `company` and `version` tags, which are used to denote the custom opportunities for a given company.

## Attachments

The way we handle attachments that are uploaded to the system is by storing them in Azure Blob Storage. For each file to be uploaded, we generate an URl with a fixed lifetime of few minutes, which is basically a proxy to a SAS url pointing to the said storage. This way, we can control the access to the files and make sure that they are not accessible after the lifetime of the URL has expired.

The files are then referenced inside the notes' content by the given ID of the attachment. Once we load a file, we ask the backend for the attachments related to the given note and let the frontend load them by the SAS urls generated for that purpose.
