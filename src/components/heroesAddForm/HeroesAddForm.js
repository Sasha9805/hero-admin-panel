import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { string, object } from "yup";
import { v4 as uuidv4 } from 'uuid';

import { useHttp } from "../../hooks/http.hook";
import { heroAdd } from "../../actions";
import Spinner from "../spinner/Spinner";

import './heroesAddForm.scss';

// Задача для этого компонента:
// Реализовать создание нового героя с введенными данными. Он должен попадать
// в общее состояние и отображаться в списке + фильтроваться
// Уникальный идентификатор персонажа можно сгенерировать через uiid
// Усложненная задача:
// Персонаж создается и в файле json при помощи метода POST
// Дополнительно:
// Элементы <option></option> желательно сформировать на базе
// данных из фильтров

const HeroesAddForm = () => {
    const { request } = useHttp();

    const { filters, filtersLoadingStatus } = useSelector(state => state.filters);
    const dispatch = useDispatch();

    const onSubmit = ({ name, text, element }, { setSubmitting, resetForm }) => {
        const newHero = {
            id: uuidv4(),
            name,
            description: text,
            element
        };
        request(`http://localhost:3001/heroes`, 'POST', JSON.stringify(newHero))
            .then(data => {
                dispatch(heroAdd(data));
                resetForm();
            })
            .catch(err => console.log(err))
            .finally(() => setSubmitting(false));
    };

    if (filtersLoadingStatus === "loading") {
        return (
            <div style={{display: 'flex'}}>
                <Spinner/>
            </div>
        );
    } else if (filtersLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

    const renderOptions = (arr) => {
        return arr.map(({ value, text }) => {
            if (value === 'all') {
                return <option key={value} value="">Я владею элементом...</option>;
            }
            return <option key={value} value={value}>{text}</option>
        });
    };
    const options = renderOptions(filters);

    return (
        <Formik
            initialValues={{
                name: '',
                text: '',
                element: '',
            }}
            validationSchema={object({
                name: string().required('Это поле обязательное'),
                text: string().required('Это поле обязательное'),
                element: string().required('Выберите элемент'),
            })}
            onSubmit={onSubmit}
        >
            {
                ({ isSubmitting }) => {
                    return (
                        <Form className="border p-4 shadow-lg rounded">
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
                                <Field name="name" id="name" className="form-control" placeholder="Как меня зовут?" />
                                <ErrorMessage name="name" className="heroes__add-form_error" component="div" />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="text" className="form-label fs-4">Имя нового героя</label>
                                <Field as="textarea" name="text" id="text" className="form-control heroes__add-form-textarea" placeholder="Что я умею?" />
                                <ErrorMessage name="text" className="heroes__add-form_error" component="div" />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="element" className="form-label fs-4">Имя нового героя</label>
                                <Field as="select" name="element" id="element" className="form-select">
                                    {options}
                                </Field>
                                <ErrorMessage name="element" className="heroes__add-form_error" component="div" />
                            </div>

                            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>Создать</button>
                        </Form>
                    )
                }
            }
        </Formik>
    )
}

export default HeroesAddForm;