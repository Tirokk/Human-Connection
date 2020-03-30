import { storiesOf } from '@storybook/vue'
import { withA11y } from '@storybook/addon-a11y'
import { action } from '@storybook/addon-actions'

import helpers from '~/storybook/helpers'
import FollowList from './FollowList.vue'

import fuzzyFilterUser from './FollowList.story.json'

helpers.init()

const user = {
  name: 'Jenny Rostock',
  id: 'u3',
  followedByCount: 12,
  followedBy: helpers.fakeUser(7),
  followingCount: 28,
  following: helpers.fakeUser(7),
}

const allConnectionsUser = {
  ...user,
  followedBy: [...user.followedBy, ...helpers.fakeUser(5)],
  following: [...user.following, ...helpers.fakeUser(21)],
}

const noConnectionsUser = {
  ...user,
  followedBy: [],
  followedByCount: 0,
  following: [],
  followingCount: 0,
}

const wrapTemplates = (templates) => `
<div style="display: flex; flex-wrap: wrap;">
${templates.map((template) => `<div style="margin: 8px;">${template}</div>`).join('')}
</div>
`

storiesOf('FollowList', module)
  .addDecorator(withA11y)
  .addDecorator(helpers.layout)
  .add('without connections', () => {
    return {
      components: { FollowList },
      store: helpers.store,
      data() {
        return { user: noConnectionsUser }
      },
      template: wrapTemplates([
        '<follow-list :user="user" />',
        '<follow-list :user="user" type="followedBy" />',
      ]),
    }
  })
  .add('with up to 7 connections', () => {
    return {
      components: { FollowList },
      store: helpers.store,
      data() {
        return { user: { ...user } }
      },
      methods: {
        fetchAllConnections(type) {
          this.user[type] = allConnectionsUser[type]
          action('fetchAllConnections')(type, this.user)
        },
      },
      template: wrapTemplates([
        '<follow-list :user="user" @fetchAllConnections="fetchAllConnections"/>',
        '<follow-list :user="user" type="followedBy" @fetchAllConnections="fetchAllConnections"/>',
      ]),
    }
  })

  .add('with all connections', () => {
    return {
      components: { FollowList },
      store: helpers.store,
      data() {
        return { user: allConnectionsUser }
      },
      template: wrapTemplates([
        '<follow-list :user="user" />',
        '<follow-list :user="user" type="followedBy"/>',
      ]),
    }
  })
  .add('with a lot of connections', () => {
    return {
      components: { FollowList },
      store: helpers.store,
      data() {
        return {
          user: {
            ...user,
            followedByCount: 1000,
            followingCount: 1000,
            followedBy: helpers.fakeUser(1000),
            following: helpers.fakeUser(1000),
          },
        }
      },
      template: wrapTemplates([
        '<follow-list :user="user" />',
        '<follow-list :user="user" type="followedBy"/>',
      ]),
    }
  })
  .add('Fuzzy Filter', () => {
    return {
      components: { FollowList },
      store: helpers.store,
      data() {
        return { user: fuzzyFilterUser }
      },
      template: wrapTemplates([
        '<follow-list :user="user" />',
        '<follow-list :user="user" type="followedBy">',
      ]),
    }
  })
