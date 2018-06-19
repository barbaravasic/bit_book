import React, { Component, Fragment } from 'react';
import './FeedPage.css';
import { PostList } from './posts/PostList';
import { postService } from '../services/postService';
import { OptionsSidebar } from './posts/OptionsSidebar';
import { NewPostButton } from './posts/newPost/NewPostButton';
import NewPostModal from './posts/newPost/NewPostModal';
import { Pagination } from './posts/Pagination';
import { login } from '../shared/constants';


export class FeedPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: null,
            loading: true,
            modalBtn: null,
            hideModal: null,
            filteredPosts: null,
            postsCount: 0,
            active: "waves-effect"
        }
    }

    // loadData = () => {
    //     postService.getPosts()
    //         .then(posts => {
    //             this.setState({ posts, loading: false })
    //         })
    // }

    
    componentDidMount = () => {
        this.loadData();
        this.countPosts();
    }

    onNewPostClick = (event) => {
        this.setState({
            modalBtn: event.target.parentElement.getAttribute("data-target"),
            hideModal: null
        })
    }

    onCloseModal = (event) => {
        this.setState({
            hideModal: "hide"
        })

    }

    onFilterPosts = (event) => {
        const allPosts = this.state.posts;
        if (event.target.value === "all") {
            this.setState({
                filteredPosts: null
            })
        } else {

            const filteredPosts = allPosts.filter(post => {
                return post.type === event.target.value;
            })
            this.setState({
                filteredPosts
            })
        }
    }


    loadPaginationData = (event) => {
        event.preventDefault();
        const top = 10;
        const pageNum = event.target.id
        const skip = (pageNum - 1) * top;
        console.log(event.target.parentElement);

        postService.getPostsPagination(top, skip)
            .then(posts => {
                this.setState({
                    posts,
                    loading: false,
                })
            })
            window.scrollTo(0, 0);
    }

    loadData() {
        const top = 10;
        const skip = 0;
        postService.getPostsPagination(top, skip)
            .then(posts => {
                this.setState({ posts, loading: false })
            })
    }

    renderPosts = () => {
        const { loading, posts, filteredPosts } = this.state;
        if (loading) {
            return <div className="loading">Loading</div>
        }
        if (filteredPosts) {
            return <PostList posts={filteredPosts} />
        } else {

            return <PostList posts={posts} />
        }
    }

    countPosts = () => {
        postService.getPostsCount()
            .then(postsCount =>
                this.setState({
                    postsCount
                })
            )

    }

    render() {
        return (
            <Fragment>
                <div className="row">
                    <OptionsSidebar onFilterPosts={this.onFilterPosts} loadData={this.loadData} />
                    {this.renderPosts()}
                    <NewPostModal modalBtn={this.state.modalBtn} onCloseModal={this.onCloseModal} hideModal={this.state.hideModal} loadData={this.loadData} />
                    <NewPostButton onClick={this.onNewPostClick} />
                </div>
                <div className="row">
                    <Pagination loadPaginationData={this.loadPaginationData} postsCount={this.state.postsCount} active={this.state.active} pageNum={this.props.match.params.pageNum}/>
                </div>
            </Fragment>
        )
    }
}
