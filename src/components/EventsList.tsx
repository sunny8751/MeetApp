import * as React from 'react';
import * as Styles from '../styles/styles';
import EventItem, { EventItemProps } from './EventItem';
import { Text, SectionList } from './UI';

export interface EventsListProps {
    sections: {sectionTitle: string, data: EventItemProps[]}[]
}

class EventsList extends React.Component<EventsListProps> {
    constructor(props) {
        super(props);
        this.renderItem = this.renderItem.bind(this);
        this.renderSectionHeader = this.renderSectionHeader.bind(this);
    }

    renderItem(item: EventItemProps, index, section) {
        return (
            <EventItem
                {...item}
            />
        );
    }

    renderSectionHeader(sectionTitle: string) {
        const capitalizedSectionTitle = sectionTitle.replace(/\b\w/g, l => l.toUpperCase());
        return (
            <Text style={Styles.sectionTitle}>{capitalizedSectionTitle}</Text>
        );
    }

    render() {
        return (
            <SectionList
                renderItem={({item, index, section}) => this.renderItem(item, index, section) }
                renderSectionHeader={({section: {sectionTitle}}) => this.renderSectionHeader(sectionTitle) }
                sections={this.props.sections}
                keyExtractor={(item, index) => item + index}
                // stickySectionHeadersEnabled={false}
            />
        );
    }
}

export default EventsList;
