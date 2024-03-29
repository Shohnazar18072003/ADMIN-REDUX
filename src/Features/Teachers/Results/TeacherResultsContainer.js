import React from 'react';
import { useGetTeacherDataQuery } from '../teachersApiSlice';
import Loading from '../../../Components/Loading';
import { TeacherCardWrapper } from '../../../Components/TeacherCardWrapper';
import { AddResults } from './AddResults';
import { ViewResults } from './ViewResults';
import Error from '../../../Components/Error';
import { useParams } from 'react-router-dom';

export const TeacherResultsContainer = () => {
  const { classId } = useParams();

  const { data, isLoading, isSuccess, isError, error } =
    useGetTeacherDataQuery(classId);

  const { results } = data || {};

  let content;

  if (isLoading) {
    content = <Loading open={isLoading} />;
  }
  else if (isSuccess) {
    content = (
      <TeacherCardWrapper
        title='Results'
        dialogChildren={<AddResults />}
        children={<ViewResults data={results} />}
      />
    );
  }
  else if (isError) {
    <Error error={error} />;
  }
  return content;
};
