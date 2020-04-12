import Airtable from 'airtable';
import _ from 'lodash';

class airtable {
  constructor(options = {}) {
    this.options = options;

    if (!process.env.AIRTABLE_API_KEY) {
      throw new Error(
        'Airtable API access requires a key as the AIRTABLE_API_KEY environment variable.'
      );
    }

    this.airtable = new Airtable({
      apiKey: process.env.AIRTABLE_API_KEY
    });
  }

  async getTableContents(view = undefined) {
    const baseID = process.env.AIRTABLE_RESTAURANTS_BASE_ID;
    const table = process.env.AIRTABLE_RESTAURANTS_TABLE_NAME;

    // Base connection
    let base = this.airtable.base(baseID);

    // Options
    let selectOptions = {};
    if (view) {
      selectOptions.view = view;
    }

    // Collect all
    return new Promise((resolve, reject) => {
      let all = [];

      base(table)
        .select(selectOptions)
        .eachPage(
          (records, next) => {
            all = all.concat(
              records.map(r => {
                // Attach Airtable row ID to fields
                r.fields = r.fields || {};
                r.fields.airtableID = r.id;
                return r.fields;
              })
            );
            next();
          },
          error => {
            if (error) {
              return reject(error);
            }

            // Filter empty rows
            all = _.filter(all, a => {
              return a && !_.isEmpty(a);
            });

            resolve(all);
          }
        );
    });
  }
}

export default airtable;