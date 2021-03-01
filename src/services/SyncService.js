// TODO ainda não está pronto
import { isObject } from 'lodash'

export default class {
  constructor (collections, remoteBaseURL) {
    this.collections = collections
    this.collectionsStateList = {}

    this.replicationDefaults = {
      remote: '',
      waitForLeadership: true,              // (optional) [default=true] to save performance, the sync starts on leader-instance only
      direction: {                          // direction (optional) to specify sync-directions
        pull: true, // default=true
        push: true  // default=true
      },
      options: {                             // sync-options (optional) from https://pouchdb.com/api.html#replication
        live: true,
        retry: true
      }
    }
  }

  sync (syncList = []) {
    for (const sync of syncList) {
      const config = { name: sync, customConfig: null }

      if (isObject(sync)) {
        const { collectionName, ...customConfig } = sync

        config.name = collectionName
        config.customConfig = customConfig
      }

      this.makeReplication(config.name, config.customConfig)
    }
  }

  syncOne (sync) {
    this.sync([sync])
  }

  makeReplication (collectionName, replicationConfig) {
    const collection = this.collections[collectionName]

    if (!replicationConfig && this.remoteBaseURL) {
      this.replicationDefaults.remote = `${this.remoteBaseURL}/${collectionName}/`
    }

    this.collectionsStateList[collectionName] = collection.sync(replicationConfig || this.replicationDefaults)

    this.replicationDefaults.remote = ''
  }
}
