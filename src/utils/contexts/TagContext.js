import React, { useContext, useState, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'

import useTagSubscription from '../hooks/useTagsSubscription'
import useTagList from '../hooks/useTagList'
import useTagDetail from '../hooks/useTagDetail'
import useUserTags from '../hooks/useUserTags'
import useThreshold from '../hooks/useThreshhold'

export const TagContext = React.createContext({
  tags: [],
  activeTag: null,
  activeTagId: null,
  setActiveTagId: () => {},
  resetActiveTag: () => {},
  categoryList: [],
  refetch: () => {},
  upVote: () => {},
  userAddTags: null,
  refetchUserAddTags: () => {},
  updateTagList: () => {}
})

function findTagById(id, tags) {
  if (!id || !tags || tags.length === 0) return null
  const targetTag = tags.find((tag) => tag.id === id)
  return targetTag || null
}

export const TagContextProvider = ({ children }) => {
  const { tags, refetch, updateTagList } = useTagList()
  const { userAddTags, getUserTagList } = useUserTags()
  const threshold = useThreshold()

  // ! TEMP: 之後會串接 API 拿category列表？
  const categoryList = [
    {
      id: 1,
      name: '校園設施'
    },
    {
      id: 2,
      name: '校園問題'
    },
    {
      id: 3,
      name: '校園狀態'
    }
  ]
  const [activeTagId, setActiveTagId] = useState(null)
  const activeTag = findTagById(activeTagId, tags)
  const { tagDetail, getTagDetail, resetTagDetail } = useTagDetail()
  const newTag = useTagSubscription()
  const resetActiveTag = () => {
    setActiveTagId(null)
    resetTagDetail()
  }
  const fetchTagDetail = useCallback(async () => {
    getTagDetail({
      variables: { id: activeTagId }
    })
  }, [getTagDetail, activeTagId])
  useEffect(() => {
    if (newTag.changeType === 'updated' && activeTagId) {
      fetchTagDetail()
    }
  }, [newTag, fetchTagDetail, activeTagId])
  const [filterTags, setFilterTags] = useState([])
  const addFilterTags = (tag) => {
    if (filterTags.indexOf(tag) !== -1) {
      setFilterTags((prevFilterTags) =>
        prevFilterTags.filter((t) => {
          return t !== tag
        })
      )
    } else {
      setFilterTags((prevFilterTags) => [...prevFilterTags, tag])
    }
  }
  const resetFilterTags = (tag) => {
    setFilterTags((prevFilterTags) =>
      prevFilterTags.filter((t) => {
        return t !== tag
      })
    )
  }
  const contextValues = {
    tags,
    activeTag,
    activeTagId,
    setActiveTagId,
    resetActiveTag,
    categoryList,
    refetch,
    filterTags,
    addFilterTags,
    resetFilterTags,
    tagDetail,
    userAddTags,
    getUserTagList,
    fetchTagDetail,
    threshold,
    updateTagList
  }

  return (
    <TagContext.Provider value={contextValues}>{children}</TagContext.Provider>
  )
}
TagContextProvider.propTypes = {
  children: PropTypes.any
}
TagContextProvider.defaultProps = {
  children: null
}

export const useTagValue = () => useContext(TagContext)
