/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  '/': {
    get: {
      responses: {
        /** OK */
        200: unknown
      }
    }
  }
  '/auth_key': {
    get: {
      parameters: {
        query: {
          id?: parameters['rowFilter.auth_key.id']
          name?: parameters['rowFilter.auth_key.name']
          secret?: parameters['rowFilter.auth_key.secret']
          user_id?: parameters['rowFilter.auth_key.user_id']
          inserted_at?: parameters['rowFilter.auth_key.inserted_at']
          updated_at?: parameters['rowFilter.auth_key.updated_at']
          deleted_at?: parameters['rowFilter.auth_key.deleted_at']
          /** Filtering Columns */
          select?: parameters['select']
          /** Ordering */
          order?: parameters['order']
          /** Limiting and Pagination */
          offset?: parameters['offset']
          /** Limiting and Pagination */
          limit?: parameters['limit']
        }
        header: {
          /** Limiting and Pagination */
          Range?: parameters['range']
          /** Limiting and Pagination */
          'Range-Unit'?: parameters['rangeUnit']
          /** Preference */
          Prefer?: parameters['preferCount']
        }
      }
      responses: {
        /** OK */
        200: {
          schema: definitions['auth_key'][]
        }
        /** Partial Content */
        206: unknown
      }
    }
    post: {
      parameters: {
        body: {
          /** auth_key */
          auth_key?: definitions['auth_key']
        }
        query: {
          /** Filtering Columns */
          select?: parameters['select']
        }
        header: {
          /** Preference */
          Prefer?: parameters['preferReturn']
        }
      }
      responses: {
        /** Created */
        201: unknown
      }
    }
    delete: {
      parameters: {
        query: {
          id?: parameters['rowFilter.auth_key.id']
          name?: parameters['rowFilter.auth_key.name']
          secret?: parameters['rowFilter.auth_key.secret']
          user_id?: parameters['rowFilter.auth_key.user_id']
          inserted_at?: parameters['rowFilter.auth_key.inserted_at']
          updated_at?: parameters['rowFilter.auth_key.updated_at']
          deleted_at?: parameters['rowFilter.auth_key.deleted_at']
        }
        header: {
          /** Preference */
          Prefer?: parameters['preferReturn']
        }
      }
      responses: {
        /** No Content */
        204: never
      }
    }
    patch: {
      parameters: {
        query: {
          id?: parameters['rowFilter.auth_key.id']
          name?: parameters['rowFilter.auth_key.name']
          secret?: parameters['rowFilter.auth_key.secret']
          user_id?: parameters['rowFilter.auth_key.user_id']
          inserted_at?: parameters['rowFilter.auth_key.inserted_at']
          updated_at?: parameters['rowFilter.auth_key.updated_at']
          deleted_at?: parameters['rowFilter.auth_key.deleted_at']
        }
        body: {
          /** auth_key */
          auth_key?: definitions['auth_key']
        }
        header: {
          /** Preference */
          Prefer?: parameters['preferReturn']
        }
      }
      responses: {
        /** No Content */
        204: never
      }
    }
  }
  '/backup': {
    get: {
      parameters: {
        query: {
          id?: parameters['rowFilter.backup.id']
          upload_id?: parameters['rowFilter.backup.upload_id']
          url?: parameters['rowFilter.backup.url']
          inserted_at?: parameters['rowFilter.backup.inserted_at']
          /** Filtering Columns */
          select?: parameters['select']
          /** Ordering */
          order?: parameters['order']
          /** Limiting and Pagination */
          offset?: parameters['offset']
          /** Limiting and Pagination */
          limit?: parameters['limit']
        }
        header: {
          /** Limiting and Pagination */
          Range?: parameters['range']
          /** Limiting and Pagination */
          'Range-Unit'?: parameters['rangeUnit']
          /** Preference */
          Prefer?: parameters['preferCount']
        }
      }
      responses: {
        /** OK */
        200: {
          schema: definitions['backup'][]
        }
        /** Partial Content */
        206: unknown
      }
    }
    post: {
      parameters: {
        body: {
          /** backup */
          backup?: definitions['backup']
        }
        query: {
          /** Filtering Columns */
          select?: parameters['select']
        }
        header: {
          /** Preference */
          Prefer?: parameters['preferReturn']
        }
      }
      responses: {
        /** Created */
        201: unknown
      }
    }
    delete: {
      parameters: {
        query: {
          id?: parameters['rowFilter.backup.id']
          upload_id?: parameters['rowFilter.backup.upload_id']
          url?: parameters['rowFilter.backup.url']
          inserted_at?: parameters['rowFilter.backup.inserted_at']
        }
        header: {
          /** Preference */
          Prefer?: parameters['preferReturn']
        }
      }
      responses: {
        /** No Content */
        204: never
      }
    }
    patch: {
      parameters: {
        query: {
          id?: parameters['rowFilter.backup.id']
          upload_id?: parameters['rowFilter.backup.upload_id']
          url?: parameters['rowFilter.backup.url']
          inserted_at?: parameters['rowFilter.backup.inserted_at']
        }
        body: {
          /** backup */
          backup?: definitions['backup']
        }
        header: {
          /** Preference */
          Prefer?: parameters['preferReturn']
        }
      }
      responses: {
        /** No Content */
        204: never
      }
    }
  }
  '/content': {
    get: {
      parameters: {
        query: {
          cid?: parameters['rowFilter.content.cid']
          dag_size?: parameters['rowFilter.content.dag_size']
          inserted_at?: parameters['rowFilter.content.inserted_at']
          updated_at?: parameters['rowFilter.content.updated_at']
          /** Filtering Columns */
          select?: parameters['select']
          /** Ordering */
          order?: parameters['order']
          /** Limiting and Pagination */
          offset?: parameters['offset']
          /** Limiting and Pagination */
          limit?: parameters['limit']
        }
        header: {
          /** Limiting and Pagination */
          Range?: parameters['range']
          /** Limiting and Pagination */
          'Range-Unit'?: parameters['rangeUnit']
          /** Preference */
          Prefer?: parameters['preferCount']
        }
      }
      responses: {
        /** OK */
        200: {
          schema: definitions['content'][]
        }
        /** Partial Content */
        206: unknown
      }
    }
    post: {
      parameters: {
        body: {
          /** content */
          content?: definitions['content']
        }
        query: {
          /** Filtering Columns */
          select?: parameters['select']
        }
        header: {
          /** Preference */
          Prefer?: parameters['preferReturn']
        }
      }
      responses: {
        /** Created */
        201: unknown
      }
    }
    delete: {
      parameters: {
        query: {
          cid?: parameters['rowFilter.content.cid']
          dag_size?: parameters['rowFilter.content.dag_size']
          inserted_at?: parameters['rowFilter.content.inserted_at']
          updated_at?: parameters['rowFilter.content.updated_at']
        }
        header: {
          /** Preference */
          Prefer?: parameters['preferReturn']
        }
      }
      responses: {
        /** No Content */
        204: never
      }
    }
    patch: {
      parameters: {
        query: {
          cid?: parameters['rowFilter.content.cid']
          dag_size?: parameters['rowFilter.content.dag_size']
          inserted_at?: parameters['rowFilter.content.inserted_at']
          updated_at?: parameters['rowFilter.content.updated_at']
        }
        body: {
          /** content */
          content?: definitions['content']
        }
        header: {
          /** Preference */
          Prefer?: parameters['preferReturn']
        }
      }
      responses: {
        /** No Content */
        204: never
      }
    }
  }
  '/metric': {
    get: {
      parameters: {
        query: {
          name?: parameters['rowFilter.metric.name']
          value?: parameters['rowFilter.metric.value']
          inserted_at?: parameters['rowFilter.metric.inserted_at']
          updated_at?: parameters['rowFilter.metric.updated_at']
          /** Filtering Columns */
          select?: parameters['select']
          /** Ordering */
          order?: parameters['order']
          /** Limiting and Pagination */
          offset?: parameters['offset']
          /** Limiting and Pagination */
          limit?: parameters['limit']
        }
        header: {
          /** Limiting and Pagination */
          Range?: parameters['range']
          /** Limiting and Pagination */
          'Range-Unit'?: parameters['rangeUnit']
          /** Preference */
          Prefer?: parameters['preferCount']
        }
      }
      responses: {
        /** OK */
        200: {
          schema: definitions['metric'][]
        }
        /** Partial Content */
        206: unknown
      }
    }
    post: {
      parameters: {
        body: {
          /** metric */
          metric?: definitions['metric']
        }
        query: {
          /** Filtering Columns */
          select?: parameters['select']
        }
        header: {
          /** Preference */
          Prefer?: parameters['preferReturn']
        }
      }
      responses: {
        /** Created */
        201: unknown
      }
    }
    delete: {
      parameters: {
        query: {
          name?: parameters['rowFilter.metric.name']
          value?: parameters['rowFilter.metric.value']
          inserted_at?: parameters['rowFilter.metric.inserted_at']
          updated_at?: parameters['rowFilter.metric.updated_at']
        }
        header: {
          /** Preference */
          Prefer?: parameters['preferReturn']
        }
      }
      responses: {
        /** No Content */
        204: never
      }
    }
    patch: {
      parameters: {
        query: {
          name?: parameters['rowFilter.metric.name']
          value?: parameters['rowFilter.metric.value']
          inserted_at?: parameters['rowFilter.metric.inserted_at']
          updated_at?: parameters['rowFilter.metric.updated_at']
        }
        body: {
          /** metric */
          metric?: definitions['metric']
        }
        header: {
          /** Preference */
          Prefer?: parameters['preferReturn']
        }
      }
      responses: {
        /** No Content */
        204: never
      }
    }
  }
  '/pin': {
    get: {
      parameters: {
        query: {
          id?: parameters['rowFilter.pin.id']
          status?: parameters['rowFilter.pin.status']
          content_cid?: parameters['rowFilter.pin.content_cid']
          service?: parameters['rowFilter.pin.service']
          inserted_at?: parameters['rowFilter.pin.inserted_at']
          updated_at?: parameters['rowFilter.pin.updated_at']
          /** Filtering Columns */
          select?: parameters['select']
          /** Ordering */
          order?: parameters['order']
          /** Limiting and Pagination */
          offset?: parameters['offset']
          /** Limiting and Pagination */
          limit?: parameters['limit']
        }
        header: {
          /** Limiting and Pagination */
          Range?: parameters['range']
          /** Limiting and Pagination */
          'Range-Unit'?: parameters['rangeUnit']
          /** Preference */
          Prefer?: parameters['preferCount']
        }
      }
      responses: {
        /** OK */
        200: {
          schema: definitions['pin'][]
        }
        /** Partial Content */
        206: unknown
      }
    }
    post: {
      parameters: {
        body: {
          /** pin */
          pin?: definitions['pin']
        }
        query: {
          /** Filtering Columns */
          select?: parameters['select']
        }
        header: {
          /** Preference */
          Prefer?: parameters['preferReturn']
        }
      }
      responses: {
        /** Created */
        201: unknown
      }
    }
    delete: {
      parameters: {
        query: {
          id?: parameters['rowFilter.pin.id']
          status?: parameters['rowFilter.pin.status']
          content_cid?: parameters['rowFilter.pin.content_cid']
          service?: parameters['rowFilter.pin.service']
          inserted_at?: parameters['rowFilter.pin.inserted_at']
          updated_at?: parameters['rowFilter.pin.updated_at']
        }
        header: {
          /** Preference */
          Prefer?: parameters['preferReturn']
        }
      }
      responses: {
        /** No Content */
        204: never
      }
    }
    patch: {
      parameters: {
        query: {
          id?: parameters['rowFilter.pin.id']
          status?: parameters['rowFilter.pin.status']
          content_cid?: parameters['rowFilter.pin.content_cid']
          service?: parameters['rowFilter.pin.service']
          inserted_at?: parameters['rowFilter.pin.inserted_at']
          updated_at?: parameters['rowFilter.pin.updated_at']
        }
        body: {
          /** pin */
          pin?: definitions['pin']
        }
        header: {
          /** Preference */
          Prefer?: parameters['preferReturn']
        }
      }
      responses: {
        /** No Content */
        204: never
      }
    }
  }
  '/upload': {
    get: {
      parameters: {
        query: {
          id?: parameters['rowFilter.upload.id']
          user_id?: parameters['rowFilter.upload.user_id']
          key_id?: parameters['rowFilter.upload.key_id']
          content_cid?: parameters['rowFilter.upload.content_cid']
          source_cid?: parameters['rowFilter.upload.source_cid']
          mime_type?: parameters['rowFilter.upload.mime_type']
          type?: parameters['rowFilter.upload.type']
          name?: parameters['rowFilter.upload.name']
          files?: parameters['rowFilter.upload.files']
          origins?: parameters['rowFilter.upload.origins']
          meta?: parameters['rowFilter.upload.meta']
          inserted_at?: parameters['rowFilter.upload.inserted_at']
          updated_at?: parameters['rowFilter.upload.updated_at']
          deleted_at?: parameters['rowFilter.upload.deleted_at']
          /** Filtering Columns */
          select?: parameters['select']
          /** Ordering */
          order?: parameters['order']
          /** Limiting and Pagination */
          offset?: parameters['offset']
          /** Limiting and Pagination */
          limit?: parameters['limit']
        }
        header: {
          /** Limiting and Pagination */
          Range?: parameters['range']
          /** Limiting and Pagination */
          'Range-Unit'?: parameters['rangeUnit']
          /** Preference */
          Prefer?: parameters['preferCount']
        }
      }
      responses: {
        /** OK */
        200: {
          schema: definitions['upload'][]
        }
        /** Partial Content */
        206: unknown
      }
    }
    post: {
      parameters: {
        body: {
          /** upload */
          upload?: definitions['upload']
        }
        query: {
          /** Filtering Columns */
          select?: parameters['select']
        }
        header: {
          /** Preference */
          Prefer?: parameters['preferReturn']
        }
      }
      responses: {
        /** Created */
        201: unknown
      }
    }
    delete: {
      parameters: {
        query: {
          id?: parameters['rowFilter.upload.id']
          user_id?: parameters['rowFilter.upload.user_id']
          key_id?: parameters['rowFilter.upload.key_id']
          content_cid?: parameters['rowFilter.upload.content_cid']
          source_cid?: parameters['rowFilter.upload.source_cid']
          mime_type?: parameters['rowFilter.upload.mime_type']
          type?: parameters['rowFilter.upload.type']
          name?: parameters['rowFilter.upload.name']
          files?: parameters['rowFilter.upload.files']
          origins?: parameters['rowFilter.upload.origins']
          meta?: parameters['rowFilter.upload.meta']
          inserted_at?: parameters['rowFilter.upload.inserted_at']
          updated_at?: parameters['rowFilter.upload.updated_at']
          deleted_at?: parameters['rowFilter.upload.deleted_at']
        }
        header: {
          /** Preference */
          Prefer?: parameters['preferReturn']
        }
      }
      responses: {
        /** No Content */
        204: never
      }
    }
    patch: {
      parameters: {
        query: {
          id?: parameters['rowFilter.upload.id']
          user_id?: parameters['rowFilter.upload.user_id']
          key_id?: parameters['rowFilter.upload.key_id']
          content_cid?: parameters['rowFilter.upload.content_cid']
          source_cid?: parameters['rowFilter.upload.source_cid']
          mime_type?: parameters['rowFilter.upload.mime_type']
          type?: parameters['rowFilter.upload.type']
          name?: parameters['rowFilter.upload.name']
          files?: parameters['rowFilter.upload.files']
          origins?: parameters['rowFilter.upload.origins']
          meta?: parameters['rowFilter.upload.meta']
          inserted_at?: parameters['rowFilter.upload.inserted_at']
          updated_at?: parameters['rowFilter.upload.updated_at']
          deleted_at?: parameters['rowFilter.upload.deleted_at']
        }
        body: {
          /** upload */
          upload?: definitions['upload']
        }
        header: {
          /** Preference */
          Prefer?: parameters['preferReturn']
        }
      }
      responses: {
        /** No Content */
        204: never
      }
    }
  }
  '/user': {
    get: {
      parameters: {
        query: {
          id?: parameters['rowFilter.user.id']
          magic_link_id?: parameters['rowFilter.user.magic_link_id']
          github_id?: parameters['rowFilter.user.github_id']
          name?: parameters['rowFilter.user.name']
          picture?: parameters['rowFilter.user.picture']
          email?: parameters['rowFilter.user.email']
          public_address?: parameters['rowFilter.user.public_address']
          github?: parameters['rowFilter.user.github']
          inserted_at?: parameters['rowFilter.user.inserted_at']
          updated_at?: parameters['rowFilter.user.updated_at']
          /** Filtering Columns */
          select?: parameters['select']
          /** Ordering */
          order?: parameters['order']
          /** Limiting and Pagination */
          offset?: parameters['offset']
          /** Limiting and Pagination */
          limit?: parameters['limit']
        }
        header: {
          /** Limiting and Pagination */
          Range?: parameters['range']
          /** Limiting and Pagination */
          'Range-Unit'?: parameters['rangeUnit']
          /** Preference */
          Prefer?: parameters['preferCount']
        }
      }
      responses: {
        /** OK */
        200: {
          schema: definitions['user'][]
        }
        /** Partial Content */
        206: unknown
      }
    }
    post: {
      parameters: {
        body: {
          /** user */
          user?: definitions['user']
        }
        query: {
          /** Filtering Columns */
          select?: parameters['select']
        }
        header: {
          /** Preference */
          Prefer?: parameters['preferReturn']
        }
      }
      responses: {
        /** Created */
        201: unknown
      }
    }
    delete: {
      parameters: {
        query: {
          id?: parameters['rowFilter.user.id']
          magic_link_id?: parameters['rowFilter.user.magic_link_id']
          github_id?: parameters['rowFilter.user.github_id']
          name?: parameters['rowFilter.user.name']
          picture?: parameters['rowFilter.user.picture']
          email?: parameters['rowFilter.user.email']
          public_address?: parameters['rowFilter.user.public_address']
          github?: parameters['rowFilter.user.github']
          inserted_at?: parameters['rowFilter.user.inserted_at']
          updated_at?: parameters['rowFilter.user.updated_at']
        }
        header: {
          /** Preference */
          Prefer?: parameters['preferReturn']
        }
      }
      responses: {
        /** No Content */
        204: never
      }
    }
    patch: {
      parameters: {
        query: {
          id?: parameters['rowFilter.user.id']
          magic_link_id?: parameters['rowFilter.user.magic_link_id']
          github_id?: parameters['rowFilter.user.github_id']
          name?: parameters['rowFilter.user.name']
          picture?: parameters['rowFilter.user.picture']
          email?: parameters['rowFilter.user.email']
          public_address?: parameters['rowFilter.user.public_address']
          github?: parameters['rowFilter.user.github']
          inserted_at?: parameters['rowFilter.user.inserted_at']
          updated_at?: parameters['rowFilter.user.updated_at']
        }
        body: {
          /** user */
          user?: definitions['user']
        }
        header: {
          /** Preference */
          Prefer?: parameters['preferReturn']
        }
      }
      responses: {
        /** No Content */
        204: never
      }
    }
  }
  '/rpc/json_arr_to_text_arr': {
    post: {
      parameters: {
        body: {
          args: {
            /** Format: json */
            _json: string
          }
        }
        header: {
          /** Preference */
          Prefer?: parameters['preferParams']
        }
      }
      responses: {
        /** OK */
        200: unknown
      }
    }
  }
  '/rpc/create_upload': {
    post: {
      parameters: {
        body: {
          args: {
            /** Format: json */
            data: string
          }
        }
        header: {
          /** Preference */
          Prefer?: parameters['preferParams']
        }
      }
      responses: {
        /** OK */
        200: unknown
      }
    }
  }
  '/rpc/find_deals_by_content_cids': {
    post: {
      parameters: {
        body: {
          args: {
            /** Format: text[] */
            cids: string
          }
        }
        header: {
          /** Preference */
          Prefer?: parameters['preferParams']
        }
      }
      responses: {
        /** OK */
        200: unknown
      }
    }
  }
  '/rpc/pgrst_watch': {
    post: {
      parameters: {
        body: {
          args: { [key: string]: unknown }
        }
        header: {
          /** Preference */
          Prefer?: parameters['preferParams']
        }
      }
      responses: {
        /** OK */
        200: unknown
      }
    }
  }
}

export interface definitions {
  auth_key: {
    /**
     * Format: bigint
     * @description Note:
     * This is a Primary Key.<pk/>
     */
    id: number
    /** Format: text */
    name: string
    /** Format: text */
    secret: string
    /**
     * Format: bigint
     * @description Note:
     * This is a Foreign Key to `user.id`.<fk table='user' column='id'/>
     */
    user_id: number
    /**
     * Format: timestamp with time zone
     * @default timezone('utc'::text, now())
     */
    inserted_at: string
    /**
     * Format: timestamp with time zone
     * @default timezone('utc'::text, now())
     */
    updated_at: string
    /** Format: timestamp with time zone */
    deleted_at?: string
  }
  backup: {
    /**
     * Format: bigint
     * @description Note:
     * This is a Primary Key.<pk/>
     */
    id: number
    /**
     * Format: bigint
     * @description Note:
     * This is a Foreign Key to `upload.id`.<fk table='upload' column='id'/>
     */
    upload_id: number
    /** Format: text */
    url: string
    /**
     * Format: timestamp with time zone
     * @default timezone('utc'::text, now())
     */
    inserted_at: string
  }
  content: {
    /**
     * Format: text
     * @description Note:
     * This is a Primary Key.<pk/>
     */
    cid: string
    /** Format: bigint */
    dag_size?: number
    /**
     * Format: timestamp with time zone
     * @default timezone('utc'::text, now())
     */
    inserted_at: string
    /**
     * Format: timestamp with time zone
     * @default timezone('utc'::text, now())
     */
    updated_at: string
  }
  metric: {
    /**
     * Format: text
     * @description Note:
     * This is a Primary Key.<pk/>
     */
    name: string
    /** Format: bigint */
    value: number
    /**
     * Format: timestamp with time zone
     * @default timezone('utc'::text, now())
     */
    inserted_at: string
    /**
     * Format: timestamp with time zone
     * @default timezone('utc'::text, now())
     */
    updated_at: string
  }
  pin: {
    /**
     * Format: bigint
     * @description Note:
     * This is a Primary Key.<pk/>
     */
    id: number
    /** Format: public.pin_status_type */
    status: 'PinError' | 'PinQueued' | 'Pinned' | 'Pinning'
    /**
     * Format: text
     * @description Note:
     * This is a Foreign Key to `content.cid`.<fk table='content' column='cid'/>
     */
    content_cid: string
    /** Format: public.service_type */
    service: 'Pinata' | 'IpfsCluster' | 'IpfsCluster2' | 'IpfsCluster3'
    /**
     * Format: timestamp with time zone
     * @default timezone('utc'::text, now())
     */
    inserted_at: string
    /**
     * Format: timestamp with time zone
     * @default timezone('utc'::text, now())
     */
    updated_at: string
  }
  upload: {
    /**
     * Format: bigint
     * @description Note:
     * This is a Primary Key.<pk/>
     */
    id: number
    /**
     * Format: bigint
     * @description Note:
     * This is a Foreign Key to `user.id`.<fk table='user' column='id'/>
     */
    user_id: number
    /**
     * Format: bigint
     * @description Note:
     * This is a Foreign Key to `auth_key.id`.<fk table='auth_key' column='id'/>
     */
    key_id?: number
    /**
     * Format: text
     * @description Note:
     * This is a Foreign Key to `content.cid`.<fk table='content' column='cid'/>
     */
    content_cid: string
    /** Format: text */
    source_cid: string
    /** Format: text */
    mime_type?: string
    /** Format: public.upload_type */
    type: 'Car' | 'Blob' | 'Multipart' | 'Remote' | 'Nft'
    /** Format: text */
    name?: string
    /** Format: jsonb */
    files?: string
    /** Format: jsonb */
    origins?: string
    /** Format: jsonb */
    meta?: string
    /**
     * Format: timestamp with time zone
     * @default timezone('utc'::text, now())
     */
    inserted_at: string
    /**
     * Format: timestamp with time zone
     * @default timezone('utc'::text, now())
     */
    updated_at: string
    /** Format: timestamp with time zone */
    deleted_at?: string
  }
  user: {
    /**
     * Format: bigint
     * @description Note:
     * This is a Primary Key.<pk/>
     */
    id: number
    /** Format: text */
    magic_link_id?: string
    /** Format: text */
    github_id: string
    /** Format: text */
    name: string
    /** Format: text */
    picture?: string
    /** Format: text */
    email: string
    /** Format: text */
    public_address?: string
    /** Format: jsonb */
    github?: string
    /**
     * Format: timestamp with time zone
     * @default timezone('utc'::text, now())
     */
    inserted_at: string
    /**
     * Format: timestamp with time zone
     * @default timezone('utc'::text, now())
     */
    updated_at: string
  }
}

export interface parameters {
  /** @description Preference */
  preferParams: 'params=single-object'
  /** @description Preference */
  preferReturn: 'return=representation' | 'return=minimal' | 'return=none'
  /** @description Preference */
  preferCount: 'count=none'
  /** @description Filtering Columns */
  select: string
  /** @description On Conflict */
  on_conflict: string
  /** @description Ordering */
  order: string
  /** @description Limiting and Pagination */
  range: string
  /**
   * @description Limiting and Pagination
   * @default items
   */
  rangeUnit: string
  /** @description Limiting and Pagination */
  offset: string
  /** @description Limiting and Pagination */
  limit: string
  /** @description auth_key */
  'body.auth_key': definitions['auth_key']
  /** Format: bigint */
  'rowFilter.auth_key.id': string
  /** Format: text */
  'rowFilter.auth_key.name': string
  /** Format: text */
  'rowFilter.auth_key.secret': string
  /** Format: bigint */
  'rowFilter.auth_key.user_id': string
  /** Format: timestamp with time zone */
  'rowFilter.auth_key.inserted_at': string
  /** Format: timestamp with time zone */
  'rowFilter.auth_key.updated_at': string
  /** Format: timestamp with time zone */
  'rowFilter.auth_key.deleted_at': string
  /** @description backup */
  'body.backup': definitions['backup']
  /** Format: bigint */
  'rowFilter.backup.id': string
  /** Format: bigint */
  'rowFilter.backup.upload_id': string
  /** Format: text */
  'rowFilter.backup.url': string
  /** Format: timestamp with time zone */
  'rowFilter.backup.inserted_at': string
  /** @description content */
  'body.content': definitions['content']
  /** Format: text */
  'rowFilter.content.cid': string
  /** Format: bigint */
  'rowFilter.content.dag_size': string
  /** Format: timestamp with time zone */
  'rowFilter.content.inserted_at': string
  /** Format: timestamp with time zone */
  'rowFilter.content.updated_at': string
  /** @description metric */
  'body.metric': definitions['metric']
  /** Format: text */
  'rowFilter.metric.name': string
  /** Format: bigint */
  'rowFilter.metric.value': string
  /** Format: timestamp with time zone */
  'rowFilter.metric.inserted_at': string
  /** Format: timestamp with time zone */
  'rowFilter.metric.updated_at': string
  /** @description pin */
  'body.pin': definitions['pin']
  /** Format: bigint */
  'rowFilter.pin.id': string
  /** Format: public.pin_status_type */
  'rowFilter.pin.status': string
  /** Format: text */
  'rowFilter.pin.content_cid': string
  /** Format: public.service_type */
  'rowFilter.pin.service': string
  /** Format: timestamp with time zone */
  'rowFilter.pin.inserted_at': string
  /** Format: timestamp with time zone */
  'rowFilter.pin.updated_at': string
  /** @description upload */
  'body.upload': definitions['upload']
  /** Format: bigint */
  'rowFilter.upload.id': string
  /** Format: bigint */
  'rowFilter.upload.user_id': string
  /** Format: bigint */
  'rowFilter.upload.key_id': string
  /** Format: text */
  'rowFilter.upload.content_cid': string
  /** Format: text */
  'rowFilter.upload.source_cid': string
  /** Format: text */
  'rowFilter.upload.mime_type': string
  /** Format: public.upload_type */
  'rowFilter.upload.type': string
  /** Format: text */
  'rowFilter.upload.name': string
  /** Format: jsonb */
  'rowFilter.upload.files': string
  /** Format: jsonb */
  'rowFilter.upload.origins': string
  /** Format: jsonb */
  'rowFilter.upload.meta': string
  /** Format: timestamp with time zone */
  'rowFilter.upload.inserted_at': string
  /** Format: timestamp with time zone */
  'rowFilter.upload.updated_at': string
  /** Format: timestamp with time zone */
  'rowFilter.upload.deleted_at': string
  /** @description user */
  'body.user': definitions['user']
  /** Format: bigint */
  'rowFilter.user.id': string
  /** Format: text */
  'rowFilter.user.magic_link_id': string
  /** Format: text */
  'rowFilter.user.github_id': string
  /** Format: text */
  'rowFilter.user.name': string
  /** Format: text */
  'rowFilter.user.picture': string
  /** Format: text */
  'rowFilter.user.email': string
  /** Format: text */
  'rowFilter.user.public_address': string
  /** Format: jsonb */
  'rowFilter.user.github': string
  /** Format: timestamp with time zone */
  'rowFilter.user.inserted_at': string
  /** Format: timestamp with time zone */
  'rowFilter.user.updated_at': string
}

export interface operations {}

export interface external {}
